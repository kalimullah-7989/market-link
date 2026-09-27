<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Market;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function index(Request $request)
    {
        $userLat = $request->query('lat');
        $userLng = $request->query('lng');

        $markets = Market::where('is_active', true)
            ->withCount(['farmers' => function ($q) {
                $q->where('approval_status', 'approved');
            }])
            ->orderBy('name', 'asc')
            ->get();

        if ($userLat && $userLng) {
            $lat1 = (float) $userLat;
            $lon1 = (float) $userLng;

            $markets = $markets->map(function ($market) use ($lat1, $lon1) {
                $lat2 = (float) $market->latitude;
                $lon2 = (float) $market->longitude;

                $theta = $lon1 - $lon2;
                $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
                $dist = acos(min(max($dist, -1.0), 1.0));
                $dist = rad2deg($dist);
                $miles = $dist * 60 * 1.1515;
                $km = round($miles * 1.609344, 2);

                $market->distance_km = $km;
                $market->pin_status  = $this->resolvePinStatus($market);
                return $market;
            })->sortBy('distance_km')->values();
        } else {
            $markets = $markets->map(function ($market) {
                $market->pin_status = $this->resolvePinStatus($market);
                return $market;
            });
        }

        return $this->success($markets, 'Markets retrieved successfully');
    }

    public function show($id)
    {
        $market = Market::with(['farmers' => function ($q) {
            $q->where('approval_status', 'approved')->with('user');
        }])->find($id);

        if (!$market) {
            return $this->error('Market not found', 404);
        }

        $market->pin_status = $this->resolvePinStatus($market);

        return $this->success($market, 'Market details retrieved');
    }

    private function resolvePinStatus(Market $market): string
    {
        $now = Carbon::now();
        $todayName = $now->format('l');

        if (!in_array($todayName, $market->operating_days ?? [])) {
            return 'closed';
        }

        $opening = Carbon::createFromFormat('h:i A', $market->opening_time);
        $closing = Carbon::createFromFormat('h:i A', $market->closing_time);

        if ($now->lt($opening) || $now->gte($closing)) {
            return 'closed';
        }

        if ($now->diffInMinutes($closing) <= 60) {
            return 'closing_soon';
        }

        return 'open';
    }
}
