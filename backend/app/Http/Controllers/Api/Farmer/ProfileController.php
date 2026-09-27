<?php

namespace App\Http\Controllers\Api\Farmer;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $farmer = $request->user()->load(['farmerProfile.market']);

        return $this->success($farmer, 'Farmer profile retrieved');
    }

    public function update(Request $request)
    {
        $farmer = $request->user();
        $profile = $farmer->farmerProfile;

        if (!$profile) {
            $profile = FarmerProfile::create([
                'user_id' => $farmer->id,
                'farm_name' => $farmer->name . "'s Farm",
                'approval_status' => 'pending',
            ]);
        }

        $validated = $request->validate([
            'farm_name' => 'sometimes|string|max:255',
            'stall_number' => 'nullable|string|max:50',
            'stall_category' => 'nullable|string|max:100',
            'stall_items' => 'nullable|string',
            'operating_days' => 'nullable|array',
            'market_id' => 'nullable|exists:markets,id',
            'farm_address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'farm_latitude' => 'nullable|numeric',
            'farm_longitude' => 'nullable|numeric',
            'stall_latitude' => 'nullable|numeric',
            'stall_longitude' => 'nullable|numeric',
            'pickup_slots' => 'nullable|array',
            'pickup_slots.*' => 'string',
            'cutoff_hours' => 'nullable|integer|min:1|max:48',
            'bio' => 'nullable|string',
        ]);

        $profile->update($validated);

        if ($request->filled('city') || $request->filled('country')) {
            $farmer->update(array_filter([
                'city' => $request->city,
                'country' => $request->country,
            ]));
        }

        return $this->success($profile->load('market'), 'Farmer profile updated successfully');
    }

    public function submitStall(Request $request)
    {
        $farmer = $request->user();
        $profile = $farmer->farmerProfile;

        if (!$profile) {
            $profile = FarmerProfile::create([
                'user_id' => $farmer->id,
                'farm_name' => $farmer->name . "'s Farm",
                'approval_status' => 'pending',
            ]);
        }

        $validated = $request->validate([
            'farm_name'      => 'required|string|max:255',
            'stall_number'   => 'required|string|max:50',
            'stall_category' => 'required|string|max:100',
            'stall_items'    => 'required|string',
            'market_id'      => 'required|exists:markets,id',
            'city'           => 'nullable|string|max:100',
            'country'        => 'nullable|string|max:100',
            'bio'            => 'nullable|string',
            'operating_days' => 'nullable|array',
            'cutoff_hours'   => 'nullable|integer|min:1|max:48',
        ], [
            'farm_name.required'      => 'Stall / Farm name is required.',
            'stall_number.required'   => 'Stall number is required (e.g. Stall #A-04).',
            'stall_category.required' => 'Please select or specify what type/category of stall you are opening.',
            'stall_items.required'    => 'Please specify what produce/items you will be selling at this stall.',
            'market_id.required'      => 'Please select an assigned weekly farmers market hub.',
        ]);

        $profile->update([
            'farm_name'       => $validated['farm_name'],
            'stall_number'    => $validated['stall_number'],
            'stall_category'  => $validated['stall_category'],
            'stall_items'     => $validated['stall_items'],
            'market_id'       => $validated['market_id'],
            'city'            => $validated['city'] ?? $profile->city ?? $farmer->city,
            'country'         => $validated['country'] ?? $profile->country ?? $farmer->country ?? 'Pakistan',
            'bio'             => $validated['bio'] ?? $profile->bio,
            'operating_days'  => $validated['operating_days'] ?? ['Saturday', 'Sunday'],
            'cutoff_hours'    => $validated['cutoff_hours'] ?? 4,
            'approval_status' => 'pending',
        ]);

        if (!empty($validated['city']) || !empty($validated['country'])) {
            $farmer->update(array_filter([
                'city' => $validated['city'] ?? null,
                'country' => $validated['country'] ?? null,
            ]));
        }

        // Notify Admins about the new stall submission
        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            $profile->load('market');
            $cCity = $profile->city ?? $farmer->city ?? 'Local';
            $cCountry = $profile->country ?? $farmer->country ?? 'Pakistan';
            $cPhone = $farmer->phone ?? 'N/A';
            $marketName = $profile->market?->name ?? 'Weekly Farmers Market';
            Notification::create([
                'user_id' => $admin->id,
                'title'   => 'New Stall Application Submitted',
                'message' => "Farmer {$farmer->name} (Phone: {$cPhone}, City: {$cCity}, {$cCountry}) submitted stall '{$validated['farm_name']}' ({$validated['stall_number']}) at '{$marketName}' for approval. Category: {$validated['stall_category']}.",
                'type'    => 'stall_application',
            ]);
        }

        // Notify the Farmer
        Notification::create([
            'user_id' => $farmer->id,
            'title'   => 'Stall Application Submitted',
            'message' => "Your stall '{$validated['farm_name']}' has been submitted for Admin approval. Once approved, it will go live on the marketplace.",
            'type'    => 'stall_submitted',
        ]);

        return $this->success(
            $profile->load('market'),
            'Stall application submitted successfully. It is now awaiting Admin review and approval.'
        );
    }
}
