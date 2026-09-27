import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authAPI, marketsAPI } from '../services/api';
import { marketsData, COUNTRIES_CONFIG } from '../data/marketsData';
import './AuthModal.css';

const LOCALIZED_COUNTRY_NAMES = {
  en: { PK: 'Pakistan', AE: 'United Arab Emirates', SA: 'Saudi Arabia', GB: 'United Kingdom', US: 'United States' },
  ur: { PK: 'پاکستان', AE: 'متحدہ عرب امارات', SA: 'سعودی عرب', GB: 'برطانیہ', US: 'امریکہ' },
  ar: { PK: 'باكستان', AE: 'الإمارات العربية المتحدة', SA: 'المملكة العربية السعودية', GB: 'المملكة المتحدة', US: 'الولايات المتحدة' }
};

const LOCALIZED_CITY_NAMES = {
  en: {
    Lahore: 'Lahore', Karachi: 'Karachi', Islamabad: 'Islamabad', Multan: 'Multan', Faisalabad: 'Faisalabad', Peshawar: 'Peshawar', Quetta: 'Quetta',
    Dubai: 'Dubai', 'Abu Dhabi': 'Abu Dhabi', Sharjah: 'Sharjah',
    Riyadh: 'Riyadh', Jeddah: 'Jeddah', Dammam: 'Dammam',
    London: 'London', Manchester: 'Manchester', Edinburgh: 'Edinburgh',
    'New York': 'New York', 'Los Angeles': 'Los Angeles', Chicago: 'Chicago'
  },
  ur: {
    Lahore: 'لاہور', Karachi: 'کراچی', Islamabad: 'اسلام آباد', Multan: 'ملتان', Faisalabad: 'فیصل آباد', Peshawar: 'پشاور', Quetta: 'کوئٹہ',
    Dubai: 'دبئی', 'Abu Dhabi': 'ابو ظہبی', Sharjah: 'شارجہ',
    Riyadh: 'ریاض', Jeddah: 'جدہ', Dammam: 'دمام',
    London: 'لندن', Manchester: 'مانچسٹر', Edinburgh: 'ایڈنبرا',
    'New York': 'نیو یارک', 'Los Angeles': 'لاس اینجلس', Chicago: 'شکاگو'
  },
  ar: {
    Lahore: 'لاهور', Karachi: 'كراتشي', Islamabad: 'إسلام آباد', Multan: 'ملتان', Faisalabad: 'فيصل آباد', Peshawar: 'بيشاور', Quetta: 'كويتا',
    Dubai: 'دبي', 'Abu Dhabi': 'أبو ظبي', Sharjah: 'الشارقة',
    Riyadh: 'الرياض', Jeddah: 'جدة', Dammam: 'الدمام',
    London: 'لندن', Manchester: 'مانشستر', Edinburgh: 'إدنبرة',
    'New York': 'نيويورك', 'Los Angeles': 'لوس أنجلوس', Chicago: 'شيكاغو'
  }
};

const AUTH_DICT = {
  en: {
    backToLogin: 'Back to Log In',
    backToSignup: 'Back to Sign Up',
    tabLogin: 'Log In',
    tabSignup: 'Sign Up',
    googleLogin: 'Continue with Google',
    googleSignupFarmer: 'Sign up with Google (As Farmer)',
    googleSignupCustomer: 'Sign up with Google (As Customer)',
    orLoginWithEmail: 'or log in with email',
    orRegisterWithEmail: 'or register with email',
    roleLabel: 'Register As:',
    roleCustomer: 'Customer',
    roleCustomerSub: 'Pre-order & QR Pickup',
    roleFarmer: 'Farmer / Vendor',
    roleFarmerSub: 'Sell produce & manage stall',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'name@example.com',
    phone: 'Phone Number',
    phoneFarmer: 'Contact / Phone * (Mandatory)',
    phonePlaceholder: '+92 300 1234567',
    chooseCountry: 'Choose Country:',
    citiesIn: 'Cities in',
    chooseCity: 'Choose City:',
    countryLabel: 'Country * (Mandatory)',
    cityLabel: 'City * (Mandatory)',
    marketLabel: 'Choose Farmers Market / Bazar for Stall *',
    bazarsIn: 'Markets in',
    selectMarketEmpty: '-- Choose Farmers Market --',
    farmNameLabel: 'Farm / Stall Name * (Mandatory)',
    farmNamePlaceholder: 'e.g. Green Valley Organic Farm',
    stallNumberLabel: 'Stall # * (Mandatory)',
    stallNumberPlaceholder: 'e.g. Stall #A-04',
    password: 'Password',
    passwordPlaceholder: 'Strong password (e.g. Market@2026)',
    passwordMinPlaceholder: 'Strong password (e.g. Market@2026)',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    forgotPassword: 'Forgot Password?',
    hide: 'Hide',
    show: 'Show',
    notRobot: "I'm not a robot",
    recaptchaTerms: 'Privacy - Terms',
    loginBtn: 'Log In to Portal',
    loggingIn: 'Verifying Credentials...',
    createFarmerBtn: 'Create Farmer Account',
    createCustomerBtn: 'Create Customer Account',
    creatingAccount: 'Creating Account...',
    adminPortalLogin: 'Admin Portal Login',
    resetPasswordTitle: 'Reset Password',
    resetPasswordSub: 'Enter your registered email address or mobile phone number. A 6-digit verification code will be sent privately to you.',
    emailOrPhone: 'Registered Email or Phone Number',
    emailOrPhonePlaceholder: 'name@example.com or 0300-1234567',
    sendCodeBtn: 'Send Verification Code',
    sendingCode: 'Sending Code...',
    rememberPassword: 'Remember password? Log In',
    enterCodeTitle: 'Enter Verification Code',
    codeSentTo: 'A 6-digit code was sent to',
    codeSentInstruction: 'Please check your inbox or SMS and enter the 6-digit code. For privacy and security, this code is NOT displayed on screen.',
    changeEmail: 'Change email / phone',
    sixDigitLabel: '6-Digit Verification Code',
    newPasswordLabel: 'New Password',
    confirmNewPasswordLabel: 'Confirm New Password',
    resetPasswordBtn: 'Reset Password & Log In',
    updatingPassword: 'Verifying & Updating...',
    cancelReturnLogin: 'Cancel and Return to Login',
    googleTitleRegister: 'Sign up with Google',
    googleTitleLogin: 'Sign in with Google',
    googleSub: 'Authenticate your Google account to continue to MarketLink',
    googleRoleFarmer: 'Role: Farmer / Stall Owner',
    googleRoleCustomer: 'Role: Customer',
    googleAccountName: 'Google Account Name',
    gmailAddress: 'Gmail Address',
    googleTerms: 'To continue, Google will share your name, email address, language preference, and profile picture with MarketLink.',
    googleContinue: 'Continue with Google Account',
    cancel: 'Cancel',
    errEmailRequired: 'Please enter your email address.',
    errEmailOrPhoneRequired: 'Please enter your registered email address or phone number.',
    errPasswordRequired: 'Please enter your password.',
    errRobotRequired: "Please complete the security check ('I'm not a robot').",
    errNameRequired: 'Please enter your full name.',
    errValidEmailRequired: 'Please enter a valid email address or phone number.',
    errPhoneRequired: 'Contact phone number is mandatory for farmer registration.',
    errCityRequired: 'City name is mandatory for farmer registration.',
    errCountryRequired: 'Country name is mandatory for farmer registration.',
    errMarketRequired: 'Please select a farmers market / weekly bazar where you want to set up your stall.',
    errFarmNameRequired: 'Farm / Stall business name is mandatory for farmer registration.',
    errStallNumberRequired: 'Stall number is mandatory for farmer registration.',
    errPasswordShort: 'Password must include at least one uppercase letter (A-Z) and one special character (e.g. @, #, $, !).',
    errPasswordStrongRequired: 'Password must include at least one uppercase letter (A-Z) and one special character (e.g. @, #, $, !).',
    errPasswordMismatch: 'Passwords do not match. Please verify your password.',
    errOtpRequired: 'Please enter the 6-digit verification code received in your email or SMS.',
    errLoginFailed: 'Invalid email or password. Please try again.',
    errConnection: 'Connection error. Please try again.',
    succLoggedIn: 'Logged in successfully! Redirecting...',
    succAccountCreated: 'Account created successfully! Welcome to MarketLink.',
    succCodeSent: 'A 6-digit verification code has been dispatched to your email or SMS. Please check your inbox or messages.',
    succPasswordReset: 'Password reset successfully! Please log in with your new password.',
  },
  ur: {
    backToLogin: 'لاگ ان پر واپس جائیں',
    backToSignup: 'رجسٹریشن پر واپس جائیں',
    tabLogin: 'لاگ ان',
    tabSignup: 'نیا اکاؤنٹ بنائیں',
    googleLogin: 'گوگل کے ساتھ لاگ ان کریں',
    googleSignupFarmer: 'کسان کے طور پر گوگل سے سائن اپ کریں',
    googleSignupCustomer: 'گاہک کے طور پر گوگل سے سائن اپ کریں',
    orLoginWithEmail: 'یا ای میل کے ذریعے لاگ ان کریں',
    orRegisterWithEmail: 'یا ای میل کے ذریعے اکاؤنٹ بنائیں',
    roleLabel: 'اکاؤنٹ کی قسم منتخب کریں:',
    roleCustomer: 'گاہک / خریدار',
    roleCustomerSub: 'پیشگی آرڈر اور اسٹال سے وصولی',
    roleFarmer: 'کسان / وینڈر',
    roleFarmerSub: 'فصل فروخت کریں اور اسٹال سنبھالیں',
    fullName: 'پورا نام',
    fullNamePlaceholder: 'اپنا پورا نام درج کریں',
    email: 'ای میل ایڈریس',
    emailPlaceholder: 'name@example.com',
    phone: 'موبائل فون نمبر',
    phoneFarmer: 'رابطہ فون نمبر * (لازمی)',
    phonePlaceholder: '0300-1234567',
    chooseCountry: 'ملک منتخب کریں:',
    citiesIn: 'کے شہر',
    chooseCity: 'شہر منتخب کریں:',
    countryLabel: 'ملک * (لازمی)',
    cityLabel: 'شہر * (لازمی)',
    marketLabel: 'کس کسان منڈی یا بازار میں اسٹال لگانا ہے؟ *',
    bazarsIn: 'میں بازار دستیاب ہیں',
    selectMarketEmpty: '-- کسان بازار منتخب کریں --',
    farmNameLabel: 'فارم یا اسٹال کا نام * (لازمی)',
    farmNamePlaceholder: 'مثلاً: گرین ویلی آرگینک فارم',
    stallNumberLabel: 'اسٹال نمبر * (لازمی)',
    stallNumberPlaceholder: 'مثلاً: Stall #A-04',
    password: 'پاس ورڈ',
    passwordPlaceholder: 'مضبوط پاس ورڈ (مثال: Market@2026)',
    passwordMinPlaceholder: 'مضبوط پاس ورڈ (مثال: Market@2026)',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    confirmPasswordPlaceholder: 'پاس ورڈ دوبارہ درج کریں',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    hide: 'چھپائیں',
    show: 'دیکھیں',
    notRobot: 'میں روبوٹ نہیں ہوں',
    recaptchaTerms: 'رازداری - شرائط',
    loginBtn: 'پورٹل میں لاگ ان کریں',
    loggingIn: 'تصدیق کی جا رہی ہے...',
    createFarmerBtn: 'کسان اکاؤنٹ بنائیں',
    createCustomerBtn: 'گاہک اکاؤنٹ بنائیں',
    creatingAccount: 'اکاؤنٹ بنایا جا رہا ہے...',
    adminPortalLogin: 'ایڈمن پورٹل لاگ ان',
    resetPasswordTitle: 'پاس ورڈ دوبارہ ترتیب دیں',
    resetPasswordSub: 'اپنا رجسٹرڈ ای میل یا موبائل فون نمبر درج کریں۔ 6 ہندسوں کا تصدیقی کوڈ آپ کے ای میل یا فون پر رازداری سے بھیجا جائے گا۔',
    emailOrPhone: 'رجسٹرڈ ای میل یا موبائل نمبر',
    emailOrPhonePlaceholder: 'name@example.com یا 0300-1234567',
    sendCodeBtn: 'تصدیقی کوڈ بھیجیں',
    sendingCode: 'کوڈ بھیجا جا رہا ہے...',
    rememberPassword: 'پاس ورڈ یاد ہے؟ لاگ ان کریں',
    enterCodeTitle: 'تصدیقی کوڈ درج کریں',
    codeSentTo: '6 ہندسوں کا کوڈ بھیج دیا گیا ہے:',
    codeSentInstruction: 'برائے مہربانی اپنا ای میل ان باکس یا ایس ایم ایس چیک کر کے کوڈ یہاں درج کریں۔ سیکیورٹی کی خاطر یہ کوڈ اسکرین پر نہیں دکھایا جاتا۔',
    changeEmail: 'ای میل / فون تبدیل کریں',
    sixDigitLabel: '6 ہندسوں کا تصدیقی کوڈ',
    newPasswordLabel: 'نیا پاس ورڈ',
    confirmNewPasswordLabel: 'نئے پاس ورڈ کی تصدیق کریں',
    resetPasswordBtn: 'پاس ورڈ تبدیل کریں اور لاگ ان ہوں',
    updatingPassword: 'تصدیق اور تبدیلی ہو رہی ہے...',
    cancelReturnLogin: 'منسوخ کریں اور لاگ ان پر واپس جائیں',
    googleTitleRegister: 'گوگل کے ساتھ اکاؤنٹ بنائیں',
    googleTitleLogin: 'گوگل کے ساتھ لاگ ان کریں',
    googleSub: 'مارکیٹ لنک کے لیے اپنے گوگل اکاؤنٹ سے تصدیق کریں',
    googleRoleFarmer: 'اکاؤنٹ: کسان / اسٹال مالک',
    googleRoleCustomer: 'اکاؤنٹ: گاہک / خریدار',
    googleAccountName: 'گوگل اکاؤنٹ کا نام',
    gmailAddress: 'جی میل ایڈریس',
    googleTerms: 'جاری رکھنے پر گوگل آپ کا نام، ای میل ایڈریس اور پروفائل تصویر مارکیٹ لنک کے ساتھ شیئر کرے گا۔',
    googleContinue: 'گوگل اکاؤنٹ کے ساتھ جاری رکھیں',
    cancel: 'منسوخ کریں',
    errEmailRequired: 'برائے مہربانی اپنا ای میل ایڈریس درج کریں۔',
    errEmailOrPhoneRequired: 'برائے مہربانی اپنا رجسٹرڈ ای میل یا فون نمبر درج کریں۔',
    errPasswordRequired: 'برائے مہربانی اپنا پاس ورڈ درج کریں۔',
    errRobotRequired: "برائے مہربانی سیکیورٹی چیک مکمل کریں ('میں روبوٹ نہیں ہوں')۔",
    errNameRequired: 'برائے مہربانی اپنا پورا نام درج کریں۔',
    errValidEmailRequired: 'برائے مہربانی درست ای میل ایڈریس یا فون نمبر درج کریں۔',
    errPhoneRequired: 'کسان رجسٹریشن کے لیے رابطہ فون نمبر لازمی ہے۔',
    errCityRequired: 'کسان رجسٹریشن کے لیے شہر کا نام لازمی ہے۔',
    errCountryRequired: 'کسان رجسٹریشن کے لیے ملک کا نام لازمی ہے۔',
    errMarketRequired: 'برائے مہربانی وہ کسان بازار منتخب کریں جہاں آپ اسٹال لگانا چاہتے ہیں۔',
    errFarmNameRequired: 'کسان رجسٹریشن کے لیے فارم یا اسٹال کا نام لازمی ہے۔',
    errStallNumberRequired: 'کسان رجسٹریشن کے لیے اسٹال نمبر لازمی ہے۔',
    errPasswordShort: 'پاس ورڈ میں کم از کم ایک بڑا انگریزی حرف (A-Z) اور ایک خاص علامت (جیسے @, #, $, !) لازمی ہونی چاہیے۔',
    errPasswordStrongRequired: 'پاس ورڈ میں کم از کم ایک بڑا انگریزی حرف (A-Z) اور ایک خاص علامت (جیسے @, #, $, !) لازمی ہونی چاہیے۔',
    errPasswordMismatch: 'پاس ورڈز ایک دوسرے سے نہیں مل رہے۔ براہ کرم تصدیق کریں۔',
    errOtpRequired: 'برائے مہربانی ای میل یا فون پر موصول شدہ 6 ہندسوں کا کوڈ درج کریں۔',
    errLoginFailed: 'ای میل یا پاس ورڈ غلط ہے۔ دوبارہ کوشش کریں۔',
    errConnection: 'سرور سے رابطہ نہ ہو سکا۔ دوبارہ کوشش کریں۔',
    succLoggedIn: 'کامیابی سے لاگ ان ہو گیا! ری ڈائریکٹ ہو رہا ہے...',
    succAccountCreated: 'اکاؤنٹ کامیابی سے بن گیا! مارکیٹ لنک میں خوش آمدید۔',
    succCodeSent: '6 ہندسوں کا تصدیقی کوڈ آپ کے ای میل یا فون نمبر پر بھیج دیا گیا ہے۔ برائے مہربانی ان باکس یا میسجز چیک کریں۔',
    succPasswordReset: 'پاس ورڈ کامیابی سے تبدیل ہو گیا! اپنے نئے پاس ورڈ سے لاگ ان کریں۔',
  },
  ar: {
    backToLogin: 'العودة لتسجيل الدخول',
    backToSignup: 'العودة للتسجيل',
    tabLogin: 'تسجيل الدخول',
    tabSignup: 'إنشاء حساب جديد',
    googleLogin: 'المتابعة باستخدام Google',
    googleSignupFarmer: 'التسجيل عبر Google (كمزارع)',
    googleSignupCustomer: 'التسجيل عبر Google (كعميل)',
    orLoginWithEmail: 'أو تسجيل الدخول عبر البريد الإلكتروني',
    orRegisterWithEmail: 'أو التسجيل عبر البريد الإلكتروني',
    roleLabel: 'اختر نوع الحساب:',
    roleCustomer: 'عميل / مشتري',
    roleCustomerSub: 'حجز مسبق واستلام بالكود QR',
    roleFarmer: 'مزارع / صاحب كشك',
    roleFarmerSub: 'بيع المحاصيل وإدارة الكشك',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    phone: 'رقم الهاتف',
    phoneFarmer: 'رقم الجوال * (إلزامي)',
    phonePlaceholder: '+971 50 1234567',
    chooseCountry: 'اختر الدولة:',
    citiesIn: 'مدن',
    chooseCity: 'اختر المدينة:',
    countryLabel: 'الدولة * (إلزامي)',
    cityLabel: 'المدينة * (إلزامي)',
    marketLabel: 'اختر سوق المزارعين لإقامة الكشك *',
    bazarsIn: 'أسواق متوفرة في',
    selectMarketEmpty: '-- اختر سوق المزارعين --',
    farmNameLabel: 'اسم المزرعة أو الكشك * (إلزامي)',
    farmNamePlaceholder: 'مثال: مزرعة الواحة العضوية',
    stallNumberLabel: 'رقم الكشك * (إلزامي)',
    stallNumberPlaceholder: 'مثال: كشك #A-04',
    password: 'كلمة المرور',
    passwordPlaceholder: 'كلمة مرور قوية (مثال: Market@2026)',
    passwordMinPlaceholder: 'كلمة مرور قوية (مثال: Market@2026)',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    hide: 'إخفاء',
    show: 'إظهار',
    notRobot: 'أنا لست برنامج روبوت',
    recaptchaTerms: 'الخصوصية - الشروط',
    loginBtn: 'تسجيل الدخول إلى البوابة',
    loggingIn: 'جارٍ التحقق من البيانات...',
    createFarmerBtn: 'إنشاء حساب مزارع',
    createCustomerBtn: 'إنشاء حساب مشتري',
    creatingAccount: 'جارٍ إنشاء الحساب...',
    adminPortalLogin: 'دخول لوحة المشرف',
    resetPasswordTitle: 'إعادة تعيين كلمة المرور',
    resetPasswordSub: 'أدخل بريدك الإلكتروني المسجل أو رقم هاتفك. سيتم إرسال رمز تحقق مكون من 6 أرقام بشكل آمن إلى بريدك أو هاتفك.',
    emailOrPhone: 'البريد الإلكتروني أو رقم الهاتف المسجل',
    emailOrPhonePlaceholder: 'name@example.com أو 050-1234567',
    sendCodeBtn: 'إرسال رمز التحقق',
    sendingCode: 'جارٍ إرسال الرمز...',
    rememberPassword: 'تذكرت كلمة المرور؟ تسجيل الدخول',
    enterCodeTitle: 'أدخل رمز التحقق',
    codeSentTo: 'تم إرسال رمز مكون من 6 أرقام إلى:',
    codeSentInstruction: 'يرجى مراجعة بريدك الإلكتروني أو رسائلك النصية وإدخال الرمز هنا. لأسباب أمنية لا يظهر هذا الرمز على الشاشة.',
    changeEmail: 'تغيير البريد / الهاتف',
    sixDigitLabel: 'رمز التحقق المكون من 6 أرقام',
    newPasswordLabel: 'كلمة المرور الجديدة',
    confirmNewPasswordLabel: 'تأكيد كلمة المرور الجديدة',
    resetPasswordBtn: 'تحديث كلمة المرور والدخول',
    updatingPassword: 'جارٍ التحديث والتحقق...',
    cancelReturnLogin: 'إلغاء والعودة لتسجيل الدخول',
    googleTitleRegister: 'إنشاء حساب عبر Google',
    googleTitleLogin: 'تسجيل الدخول عبر Google',
    googleSub: 'مصادقة حسابك عبر Google للمتابعة إلى ماركت لينك',
    googleRoleFarmer: 'نوع الحساب: مزارع / صاحب كشك',
    googleRoleCustomer: 'نوع الحساب: عميل / مشتري',
    googleAccountName: 'اسم حساب Google',
    gmailAddress: 'عنوان بريد Gmail',
    googleTerms: 'للمتابعة، ستشارك Google اسمك وعنوان بريدك الإلكتروني وصورة ملفك الشخصي مع ماركت لينك.',
    googleContinue: 'المتابعة باستخدام حساب Google',
    cancel: 'إلغاء',
    errEmailRequired: 'يرجى إدخال عنوان البريد الإلكتروني.',
    errEmailOrPhoneRequired: 'يرجى إدخال عنوان البريد الإلكتروني أو رقم الهاتف المسجل.',
    errPasswordRequired: 'يرجى إدخال كلمة المرور.',
    errRobotRequired: 'يرجى إكمال فحص الأمان (أنا لست برنامج روبوت).',
    errNameRequired: 'يرجى إدخال اسمك الكامل.',
    errValidEmailRequired: 'يرجى إدخال عنوان بريد إلكتروني أو رقم هاتف صالح.',
    errPhoneRequired: 'رقم هاتف الاتصال إلزامي لتسجيل المزارع.',
    errCityRequired: 'اسم المدينة إلزامي لتسجيل المزارع.',
    errCountryRequired: 'اسم الدولة إلزامي لتسجيل المزارع.',
    errMarketRequired: 'يرجى اختيار سوق المزارعين الذي ترغب في فتح كشكك به.',
    errFarmNameRequired: 'اسم المزرعة أو الكشك إلزامي لتسجيل المزارع.',
    errStallNumberRequired: 'رقم الكشك إلزامي لتسجيل المزارع.',
    errPasswordShort: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z) ورمز خاص واحد على الأقل (مثل @, #, $, !).',
    errPasswordStrongRequired: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A-Z) ورمز خاص واحد على الأقل (مثل @, #, $, !).',
    errPasswordMismatch: 'كلمتا المرور غير متطابقتين. يرجى التحقق.',
    errOtpRequired: 'يرجى إدخال رمز التحقق المكون من 6 أرقام المستلم في بريدك أو هاتفك.',
    errLoginFailed: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
    errConnection: 'خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
    succLoggedIn: 'تم تسجيل الدخول بنجاح! جارٍ التحويل...',
    succAccountCreated: 'تم إنشاء الحساب بنجاح! مرحباً بك في ماركت لينك.',
    succCodeSent: 'تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني أو هاتفك. يرجى التحقق من الرسائل.',
    succPasswordReset: 'تمت إعادة تعيين كلمة المرور بنجاح! يرجى تسجيل الدخول بكلمة المرور الجديدة.',
  }
};

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const { loginWithCredentials, registerUser, loginWithGoogle } = useAuth();
  const { currentLocale, currentCountry: globalCountry, isRTL } = useLanguage();
  const navigate = useNavigate();

  const txt = AUTH_DICT[currentLocale] || AUTH_DICT.en;

  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [robotVerified, setRobotVerified] = useState(false);
  const [robotVerifying, setRobotVerifying] = useState(false);

  // Live markets list for city-based stall selection
  const [marketsList, setMarketsList] = useState(marketsData);

  useEffect(() => {
    let isMounted = true;
    marketsAPI.getAll().then((data) => {
      if (isMounted && data && data.length > 0) {
        setMarketsList(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const initCountryConfig = COUNTRIES_CONFIG.find(
    (c) => c.code === (globalCountry || 'PK')
  ) || COUNTRIES_CONFIG[0];

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    role: 'customer',
    phone: '',
    city: initCountryConfig.defaultCity || 'Lahore',
    country: initCountryConfig.name || 'Pakistan',
    market_id: '',
    farm_name: '',
    stall_number: '',
    password: '',
    password_confirmation: '',
  });

  const [googleTargetRole, setGoogleTargetRole] = useState('customer');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [previousMode, setPreviousMode] = useState('login');

  // Derive current country config from COUNTRIES_CONFIG
  const currentCountryConfig = COUNTRIES_CONFIG.find(
    (c) =>
      c.name.toLowerCase() === (registerForm.country || '').toLowerCase().trim() ||
      c.code.toLowerCase() === (registerForm.country || '').toLowerCase().trim()
  ) || COUNTRIES_CONFIG[0];

  const currentCountryCities = currentCountryConfig.cities || [];

  const getCountryDisplayName = (code) => {
    return LOCALIZED_COUNTRY_NAMES[currentLocale]?.[code] || LOCALIZED_COUNTRY_NAMES.en[code] || code;
  };

  const getCityDisplayName = (cityName) => {
    return LOCALIZED_CITY_NAMES[currentLocale]?.[cityName] || LOCALIZED_CITY_NAMES.en[cityName] || cityName;
  };

  // Helper to change country and auto-switch to that country's default city & stalls
  const handleCountryChange = (newCountryName) => {
    const config = COUNTRIES_CONFIG.find(
      (c) =>
        c.name.toLowerCase() === (newCountryName || '').toLowerCase().trim() ||
        c.code.toLowerCase() === (newCountryName || '').toLowerCase().trim()
    ) || COUNTRIES_CONFIG[0];

    const defaultCity = config.defaultCity || config.cities[0]?.name || 'Karachi';
    const cityClean = defaultCity.toLowerCase().trim();
    const countryCodeClean = config.code.toLowerCase();
    const countryNameClean = config.name.toLowerCase();

    const matched = marketsList.filter((m) => {
      const mCountry = (m.country || '').toLowerCase().trim();
      const mCountryCode = (m.countryCode || '').toLowerCase().trim();
      const matchesCountry =
        mCountry === countryNameClean ||
        mCountryCode === countryCodeClean ||
        mCountry.includes(countryNameClean) ||
        countryNameClean.includes(mCountry);
      const matchesCity =
        (m.city || '').toLowerCase().trim() === cityClean ||
        (m.location || '').toLowerCase().includes(cityClean);
      return matchesCountry && matchesCity;
    });

    setRegisterForm((prev) => ({
      ...prev,
      country: config.name,
      city: defaultCity,
      market_id: matched.length > 0 ? String(matched[0].id) : ''
    }));
    if (errorMessage) setErrorMessage('');
  };

  // Helper to change city and automatically match all bazars of that city & country
  const handleCityChange = (newCity) => {
    const clean = (newCity || '').toLowerCase().trim();
    const countryCodeClean = currentCountryConfig.code.toLowerCase();
    const countryNameClean = currentCountryConfig.name.toLowerCase();

    const matched = marketsList.filter((m) => {
      const mCountry = (m.country || '').toLowerCase().trim();
      const mCountryCode = (m.countryCode || '').toLowerCase().trim();
      const matchesCountry =
        !countryNameClean ||
        mCountry === countryNameClean ||
        mCountryCode === countryCodeClean ||
        mCountry.includes(countryNameClean) ||
        countryNameClean.includes(mCountry);
      const matchesCity =
        (m.city || '').toLowerCase().trim() === clean ||
        (m.location || '').toLowerCase().includes(clean);
      return matchesCountry && matchesCity;
    });

    setRegisterForm((prev) => ({
      ...prev,
      city: newCity,
      market_id: matched.length > 0 ? String(matched[0].id) : ''
    }));
    if (errorMessage) setErrorMessage('');
  };

  const currentCityClean = (registerForm.city || '').toLowerCase().trim();
  const currentCountryClean = (registerForm.country || '').toLowerCase().trim();
  const currentCountryCode = currentCountryConfig.code.toLowerCase();

  const availableCityMarkets = marketsList.filter((m) => {
    const mCountry = (m.country || '').toLowerCase().trim();
    const mCountryCode = (m.countryCode || '').toLowerCase().trim();
    const matchesCountry =
      !currentCountryClean ||
      mCountry === currentCountryClean ||
      mCountryCode === currentCountryCode ||
      mCountry.includes(currentCountryClean) ||
      currentCountryClean.includes(mCountry);

    const matchesCity =
      (m.city || '').toLowerCase().trim() === currentCityClean ||
      (m.location || '').toLowerCase().includes(currentCityClean);

    return matchesCountry && matchesCity;
  });

  useEffect(() => {
    if (registerForm.role === 'farmer' && !registerForm.market_id && availableCityMarkets.length > 0) {
      setRegisterForm(prev => ({ ...prev, market_id: String(availableCityMarkets[0].id) }));
    }
  }, [availableCityMarkets, registerForm.role, registerForm.market_id]);

  const handleRobotClick = () => {
    if (robotVerified || robotVerifying) return;
    setRobotVerifying(true);
    setErrorMessage('');
    setTimeout(() => {
      setRobotVerifying(false);
      setRobotVerified(true);
    }, 550);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setMode(defaultMode);
      setRobotVerified(false);
      setRobotVerifying(false);
      // Align country to active global country
      const activeCfg = COUNTRIES_CONFIG.find((c) => c.code === (globalCountry || 'PK')) || COUNTRIES_CONFIG[0];
      setRegisterForm(prev => ({
        ...prev,
        country: activeCfg.name,
        city: activeCfg.defaultCity || activeCfg.cities[0]?.name || 'Lahore'
      }));
    }
  }, [isOpen, defaultMode, globalCountry]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setRobotVerified(false);
    setRobotVerifying(false);
  };

  const redirectByRole = (userRole) => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'farmer') {
      navigate('/farmer');
    } else {
      navigate('/customer');
    }
  };

  const handleOpenGoogle = (targetRole = 'customer') => {
    setErrorMessage('');

    // If signing up as a Farmer, collecting all stall & location details is strictly mandatory
    if (targetRole === 'farmer' && mode === 'register') {
      if (!registerForm.phone || !registerForm.phone.trim()) {
        setErrorMessage(txt.errPhoneRequired);
        return;
      }
      if (!registerForm.country || !registerForm.country.trim()) {
        setErrorMessage(txt.errCountryRequired);
        return;
      }
      if (!registerForm.city || !registerForm.city.trim()) {
        setErrorMessage(txt.errCityRequired);
        return;
      }
      if (!registerForm.market_id) {
        setErrorMessage(txt.errMarketRequired);
        return;
      }
      if (!registerForm.farm_name || !registerForm.farm_name.trim()) {
        setErrorMessage(txt.errFarmNameRequired);
        return;
      }
      if (!registerForm.stall_number || !registerForm.stall_number.trim()) {
        setErrorMessage(txt.errStallNumberRequired);
        return;
      }

      // Store pending farmer registration details in localStorage so callback binds them
      const pendingFarmerData = {
        phone: registerForm.phone.trim(),
        country: registerForm.country.trim(),
        city: registerForm.city.trim(),
        market_id: registerForm.market_id,
        farm_name: registerForm.farm_name.trim(),
        stall_name: registerForm.farm_name.trim(),
        stall_number: registerForm.stall_number.trim(),
      };
      localStorage.setItem('pending_farmer_google_registration', JSON.stringify(pendingFarmerData));
    }

    setLoading(true);
    setGoogleTargetRole(targetRole);
    window.location.href = `http://localhost:8000/api/auth/google?role=${targetRole}`;
  };

  const handleSelectGoogleAccount = async (profile) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const isFarmer = googleTargetRole === 'farmer';
      let pendingFarmerData = {};
      try {
        pendingFarmerData = JSON.parse(localStorage.getItem('pending_farmer_google_registration') || '{}');
      } catch (e) {}

      const result = await loginWithGoogle(
        {
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar || (isFarmer ? '/img/testimonial-2.jpg' : '/img/testimonial-1.jpg'),
          phone: pendingFarmerData.phone || registerForm.phone,
          city: pendingFarmerData.city || registerForm.city,
          country: pendingFarmerData.country || registerForm.country,
          market_id: pendingFarmerData.market_id || registerForm.market_id,
          farm_name: pendingFarmerData.farm_name || registerForm.farm_name || `${profile.name}'s Organic Farm`,
          stall_name: pendingFarmerData.farm_name || registerForm.farm_name || `${profile.name}'s Organic Farm`,
          stall_number: pendingFarmerData.stall_number || registerForm.stall_number || 'Stall #A-04',
          role: googleTargetRole
        },
        googleTargetRole
      );

      if (result.success) {
        localStorage.removeItem('pending_farmer_google_registration');
        setSuccessMessage(txt.succLoggedIn);
        setTimeout(() => {
          onClose();
          redirectByRole(result.user?.role || googleTargetRole);
        }, 500);
      } else {
        setErrorMessage(result.error || txt.errLoginFailed);
      }
    } catch (err) {
      setErrorMessage(err.message || txt.errConnection);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    const name = customGoogleName.trim();
    const email = customGoogleEmail.trim().toLowerCase();

    if (!name) {
      setErrorMessage(txt.errNameRequired);
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage(txt.errValidEmailRequired);
      return;
    }

    handleSelectGoogleAccount({
      name,
      email,
      avatar: googleTargetRole === 'farmer' ? '/img/testimonial-2.jpg' : '/img/testimonial-1.jpg'
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const email = loginForm.email.trim();
    const password = loginForm.password;

    if (!email) {
      setErrorMessage(txt.errEmailRequired);
      return;
    }

    if (!password) {
      setErrorMessage(txt.errPasswordRequired);
      return;
    }

    if (!robotVerified) {
      setErrorMessage(txt.errRobotRequired);
      return;
    }

    setLoading(true);

    try {
      const result = await loginWithCredentials(
        email,
        password,
        'verified_robot_pass',
        'recaptcha_v2_checkbox'
      );

      if (result.success) {
        setSuccessMessage(txt.succLoggedIn);
        setTimeout(() => {
          onClose();
          redirectByRole(result.user?.role);
        }, 500);
      } else {
        setErrorMessage(result.error || txt.errLoginFailed);
        setRobotVerified(false);
      }
    } catch (err) {
      setErrorMessage(err.message || txt.errConnection);
      setRobotVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const name = registerForm.name.trim();
    const email = registerForm.email.trim();
    const password = registerForm.password;
    const confirmation = registerForm.password_confirmation;
    const isFarmer = registerForm.role === 'farmer';

    if (!name) {
      setErrorMessage(txt.errNameRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage(txt.errValidEmailRequired);
      return;
    }

    if (isFarmer) {
      if (!registerForm.phone.trim()) {
        setErrorMessage(txt.errPhoneRequired);
        return;
      }
      if (!registerForm.city.trim()) {
        setErrorMessage(txt.errCityRequired);
        return;
      }
      if (!registerForm.country.trim()) {
        setErrorMessage(txt.errCountryRequired);
        return;
      }
      if (!registerForm.market_id) {
        setErrorMessage(txt.errMarketRequired);
        return;
      }
      if (!registerForm.farm_name.trim()) {
        setErrorMessage(txt.errFarmNameRequired);
        return;
      }
      if (!registerForm.stall_number.trim()) {
        setErrorMessage(txt.errStallNumberRequired);
        return;
      }
    }

    if (!password) {
      setErrorMessage(txt.errPasswordRequired);
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\\/\[\]~`]/.test(password);
    if (!hasUppercase || !hasSpecialChar) {
      setErrorMessage(txt.errPasswordStrongRequired || txt.errPasswordShort);
      return;
    }

    if (password !== confirmation) {
      setErrorMessage(txt.errPasswordMismatch);
      return;
    }

    if (!robotVerified) {
      setErrorMessage(txt.errRobotRequired);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        role: registerForm.role,
        phone: registerForm.phone.trim(),
        city: registerForm.city.trim(),
        country: registerForm.country.trim() || 'Pakistan',
        market_id: isFarmer && registerForm.market_id ? parseInt(registerForm.market_id, 10) : undefined,
        farm_name: isFarmer ? registerForm.farm_name.trim() : undefined,
        stall_name: isFarmer ? registerForm.farm_name.trim() : undefined,
        stall_number: isFarmer ? registerForm.stall_number.trim() : undefined,
        password,
        password_confirmation: confirmation,
        captcha_key: 'recaptcha_v2_checkbox',
        captcha_answer: 'verified_robot_pass',
      };

      const result = await registerUser(payload);
      if (result.success) {
        if (isFarmer) {
          try {
            const storedFarmers = JSON.parse(localStorage.getItem('marketlink_registered_farmers') || '[]');
            const newFarmerRecord = {
              id: result.user?.id || Date.now(),
              stallName: payload.farm_name || `${name}'s Organic Farm`,
              stallNumber: payload.stall_number || 'Stall #A-05',
              stallCategory: 'Organic Vegetables & Produce',
              stallItems: 'Fresh seasonal vegetables, organic greens',
              contactPerson: name,
              email: email,
              phone: payload.phone,
              city: payload.city,
              country: payload.country,
              marketName: 'Assigned Farmers Market',
              operatingDays: ['Saturday', 'Sunday'],
              status: 'Pending Approval'
            };
            storedFarmers.unshift(newFarmerRecord);
            localStorage.setItem('marketlink_registered_farmers', JSON.stringify(storedFarmers));
          } catch (e) {}
        }
        setSuccessMessage(txt.succAccountCreated);
        setTimeout(() => {
          onClose();
          redirectByRole(result.user?.role);
        }, 600);
      } else {
        setErrorMessage(result.error || 'Registration failed. Check your inputs.');
        setRobotVerified(false);
      }
    } catch (err) {
      setErrorMessage(err.message || txt.errConnection);
      setRobotVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanInput = (forgotEmail || '').trim();
    if (!cleanInput) {
      setErrorMessage(txt.errEmailOrPhoneRequired || txt.errEmailRequired);
      return;
    }

    if (!robotVerified) {
      setErrorMessage(txt.errRobotRequired);
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(cleanInput);
      if (res.success) {
        setForgotStep(2);
        setSuccessMessage(res.message || txt.succCodeSent);
        setRobotVerified(false);
        setForgotOtp(''); // Never prefill code, keep completely blank
      } else {
        setErrorMessage(res.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setErrorMessage(err.message || txt.errConnection);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotOtp || forgotOtp.trim().length < 4) {
      setErrorMessage(txt.errOtpRequired);
      return;
    }

    if (!newPassword) {
      setErrorMessage(txt.errPasswordRequired);
      return;
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\\/\[\]~`]/.test(newPassword);
    if (!hasUppercase || !hasSpecialChar) {
      setErrorMessage(txt.errPasswordStrongRequired || txt.errPasswordShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(txt.errPasswordMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: forgotEmail,
        code: forgotOtp.trim(),
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (res.success) {
        setSuccessMessage(txt.succPasswordReset);
        setLoginForm((prev) => ({ ...prev, email: forgotEmail, password: '' }));
        setForgotStep(1);
        setForgotOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          switchMode('login');
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  const renderRobotCaptcha = () => (
    <div className="marketlink-recaptcha-card">
      <div className="marketlink-recaptcha-left">
        <button
          type="button"
          className={`marketlink-recaptcha-checkbox ${robotVerified ? 'verified' : robotVerifying ? 'verifying' : ''}`}
          onClick={handleRobotClick}
          aria-label="I'm not a robot checkbox"
          disabled={robotVerified || robotVerifying}
        >
          {robotVerifying && <span className="recaptcha-spinner" />}
          {robotVerified && (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <span className="marketlink-recaptcha-label">{txt.notRobot}</span>
      </div>

      <div className="marketlink-recaptcha-badge">
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M24 4C12.95 4 4 12.95 4 24c0 4.14 1.27 7.99 3.44 11.2L12 30.64A15.86 15.86 0 0 1 8 24c0-8.84 7.16-16 16-16 3.63 0 6.98 1.21 9.68 3.24l-5.68 5.68h16V1v5.66C39.46 3.12 32.14 1 24 1z" fill="#4285F4"/>
          <path d="M44 24c0 11.05-8.95 20-20 20-4.14 0-7.99-1.27-11.2-3.44L17.36 36A15.86 15.86 0 0 0 24 40c8.84 0 16-7.16 16-16 0-3.63-1.21-6.98-3.24-9.68l5.68-5.68H29.44v16l5.66-5.66C38.88 20.54 44 27.86 44 36z" fill="#1b873a"/>
        </svg>
        <div className="marketlink-recaptcha-text">
          <span className="recaptcha-title">reCAPTCHA</span>
          <span className="recaptcha-terms">{txt.recaptchaTerms}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="marketlink-auth-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="marketlink-auth-card" dir={isRTL ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
        <div className="marketlink-auth-visual">
          <video
            className="marketlink-video-bg"
            autoPlay
            loop
            muted
            playsInline
            poster="/img/tractor-showcase.jpg"
          >
            <source src="/img/tractor-motion.mp4" type="video/mp4" />
            <source src="/tractor-motion.mp4" type="video/mp4" />
          </video>

          <div className="marketlink-video-overlay" />

          <div className="marketlink-visual-content">
            <div className="marketlink-auth-logo-title">
              <span className="text-market">Market</span>
              <span className="text-link">Link</span>
            </div>
          </div>
        </div>

        <div className="marketlink-auth-form-panel">
          <div className="marketlink-auth-header-row">
            {mode === 'forgot' || mode === 'google' ? (
              <button
                type="button"
                className="marketlink-back-btn"
                onClick={() => switchMode(mode === 'google' ? previousMode : 'login')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>{mode === 'google' ? (previousMode === 'register' ? txt.backToSignup : txt.backToLogin) : txt.backToLogin}</span>
              </button>
            ) : (
              <div className="marketlink-tabs-pill">
                <button
                  type="button"
                  className={`marketlink-tab-button ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => switchMode('login')}
                >
                  {txt.tabLogin}
                </button>
                <button
                  type="button"
                  className={`marketlink-tab-button ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => switchMode('register')}
                >
                  {txt.tabSignup}
                </button>
              </div>
            )}

            <button
              type="button"
              className="marketlink-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          {errorMessage && (
            <div className="marketlink-alert-banner error">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="marketlink-alert-banner success">
              {successMessage}
            </div>
          )}

          {mode === 'forgot' ? (
            forgotStep === 1 ? (
              <form onSubmit={handleForgotRequestOtp} noValidate>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#141e12', margin: '0 0 4px' }}>
                    {txt.resetPasswordTitle}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#556b4f', margin: 0, lineHeight: 1.45 }}>
                    {txt.resetPasswordSub}
                  </p>
                </div>

                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">
                    <i className="fa fa-envelope text-success me-1"></i>
                    {txt.emailOrPhone || txt.email}
                  </label>
                  <input
                    type="text"
                    className="marketlink-input"
                    placeholder={txt.emailOrPhonePlaceholder || 'name@example.com or 0300-1234567'}
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                {renderRobotCaptcha()}

                <button
                  type="submit"
                  className="marketlink-submit-btn"
                  disabled={loading}
                >
                  {loading ? txt.sendingCode : txt.sendCodeBtn}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="marketlink-forgot-btn"
                    onClick={() => switchMode('login')}
                  >
                    {txt.rememberPassword}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotResetPassword} noValidate>
                <div style={{ marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#141e12', margin: '0 0 4px' }}>
                    {txt.enterCodeTitle}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#556b4f', margin: 0, lineHeight: 1.45 }}>
                    {txt.codeSentTo} <strong>{forgotEmail}</strong>.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      style={{ background: 'none', border: 'none', color: '#2b4226', textDecoration: 'underline', padding: 0, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      {txt.changeEmail}
                    </button>
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', marginTop: '6px' }}>
                    <i className="fa fa-shield-alt me-1 text-success"></i> {txt.codeSentInstruction}
                  </div>
                </div>

                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">{txt.sixDigitLabel}</label>
                  <input
                    type="text"
                    className="marketlink-input"
                    placeholder="• • • • • •"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => {
                      setForgotOtp(e.target.value.replace(/\D/g, ''));
                      if (errorMessage) setErrorMessage('');
                    }}
                    style={{ letterSpacing: '6px', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}
                    required
                    autoComplete="one-time-code"
                  />
                </div>

                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">{txt.newPasswordLabel}</label>
                  <input
                    type="password"
                    className="marketlink-input"
                    placeholder={txt.passwordMinPlaceholder}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">{txt.confirmNewPasswordLabel}</label>
                  <input
                    type="password"
                    className="marketlink-input"
                    placeholder={txt.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="marketlink-submit-btn"
                  disabled={loading}
                >
                  {loading ? txt.updatingPassword : txt.resetPasswordBtn}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="marketlink-forgot-btn"
                    onClick={() => {
                      setForgotStep(1);
                      switchMode('login');
                    }}
                  >
                    {txt.cancelReturnLogin}
                  </button>
                </div>
              </form>
            )
          ) : mode === 'google' ? (
            <div className="google-chooser-container">
              <div className="google-chooser-header">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" style={{ marginBottom: '6px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 className="google-chooser-title">
                  {previousMode === 'register' ? txt.googleTitleRegister : txt.googleTitleLogin}
                </h3>
                <p className="google-chooser-subtitle">
                  {txt.googleSub}
                  {googleTargetRole === 'farmer' ? (
                    <span className="d-block text-success fw-semibold mt-1">{txt.googleRoleFarmer}</span>
                  ) : previousMode === 'register' ? (
                    <span className="d-block text-primary fw-semibold mt-1">{txt.googleRoleCustomer}</span>
                  ) : null}
                </p>
              </div>

              <form onSubmit={handleCustomGoogleSubmit} noValidate>
                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">{txt.googleAccountName}</label>
                  <input
                    type="text"
                    className="marketlink-input"
                    placeholder={txt.fullNamePlaceholder}
                    value={customGoogleName}
                    onChange={(e) => {
                      setCustomGoogleName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                <div className="marketlink-field-group">
                  <label className="marketlink-field-label">{txt.gmailAddress}</label>
                  <input
                    type="email"
                    className="marketlink-input"
                    placeholder="name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => {
                      setCustomGoogleEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    required
                  />
                </div>

                <div className="google-terms-notice">
                  {txt.googleTerms}
                </div>

                <button
                  type="submit"
                  className="marketlink-submit-btn"
                  disabled={loading}
                  style={{ backgroundColor: '#1a73e8', marginTop: '0.85rem' }}
                >
                  {loading ? 'Authenticating...' : txt.googleContinue}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                  <button
                    type="button"
                    className="marketlink-forgot-btn"
                    onClick={() => switchMode(previousMode)}
                  >
                    {txt.cancel}
                  </button>
                </div>
              </form>
            </div>
          ) : mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} noValidate>
              <button
                type="button"
                className="marketlink-google-btn"
                onClick={() => handleOpenGoogle('customer')}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{txt.googleLogin}</span>
              </button>

              <div className="marketlink-divider">
                <span>{txt.orLoginWithEmail}</span>
              </div>

              <div className="marketlink-field-group">
                <label className="marketlink-field-label">{txt.email}</label>
                <input
                  type="email"
                  className="marketlink-input"
                  placeholder={txt.emailPlaceholder}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="marketlink-field-group">
                <label className="marketlink-field-label">{txt.password}</label>
                <div className="marketlink-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="marketlink-input"
                    placeholder={txt.passwordPlaceholder}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="marketlink-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? txt.hide : txt.show}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    className="marketlink-forgot-btn"
                    onClick={() => {
                      setForgotEmail(loginForm.email || '');
                      switchMode('forgot');
                    }}
                  >
                    {txt.forgotPassword}
                  </button>
                </div>
              </div>

              {renderRobotCaptcha()}

              <button
                type="submit"
                className="marketlink-submit-btn"
                disabled={loading}
              >
                {loading ? txt.loggingIn : txt.loginBtn}
              </button>

              {/* Discreet Admin Portal Link at bottom of Login */}
              <div style={{ textAlign: 'center', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #dce8db' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/admin');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.72rem',
                    color: '#718096',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc3545')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#718096')}
                  title="Direct access to platform administrator control center"
                >
                  <i className="fa fa-shield-alt text-danger" style={{ fontSize: '11px' }}></i>
                  <span>{txt.adminPortalLogin}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} noValidate>
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#2b4226', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {txt.roleLabel}
                </div>
                <div className="marketlink-role-selector">
                  <div
                    className={`marketlink-role-card ${registerForm.role === 'customer' ? 'selected' : ''}`}
                    onClick={() => {
                      setRegisterForm({ ...registerForm, role: 'customer' });
                      if (errorMessage) setErrorMessage('');
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <strong>{txt.roleCustomer}</strong>
                    <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '1px' }}>{txt.roleCustomerSub}</div>
                  </div>
                  <div
                    className={`marketlink-role-card ${registerForm.role === 'farmer' ? 'selected' : ''}`}
                    onClick={() => {
                      setRegisterForm({ ...registerForm, role: 'farmer' });
                      if (errorMessage) setErrorMessage('');
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <strong>{txt.roleFarmer}</strong>
                    <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '1px' }}>{txt.roleFarmerSub}</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="marketlink-google-btn"
                onClick={() => handleOpenGoogle(registerForm.role)}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{registerForm.role === 'farmer' ? txt.googleSignupFarmer : txt.googleSignupCustomer}</span>
              </button>

              <div className="marketlink-divider">
                <span>{txt.orRegisterWithEmail}</span>
              </div>

              {registerForm.role === 'customer' ? (
                <>
                  <div className="marketlink-field-group">
                    <label className="marketlink-field-label">{txt.fullName}</label>
                    <input
                      type="text"
                      className="marketlink-input"
                      placeholder={txt.fullNamePlaceholder}
                      value={registerForm.name}
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, name: e.target.value });
                        if (errorMessage) setErrorMessage('');
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.email}</label>
                      <input
                        type="email"
                        className="marketlink-input"
                        placeholder={txt.emailPlaceholder}
                        value={registerForm.email}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, email: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.phone}</label>
                      <input
                        type="tel"
                        className="marketlink-input"
                        placeholder={txt.phonePlaceholder}
                        value={registerForm.phone}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, phone: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.password}</label>
                      <input
                        type="password"
                        className="marketlink-input"
                        placeholder={txt.passwordMinPlaceholder}
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.confirmPassword}</label>
                      <input
                        type="password"
                        className="marketlink-input"
                        placeholder={txt.confirmPasswordPlaceholder}
                        value={registerForm.password_confirmation}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password_confirmation: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Farmer Registration - Compact 2-Column Responsive Layout */
                <>
                  {/* Row 1: Full Name & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.fullName}</label>
                      <input
                        type="text"
                        className="marketlink-input"
                        placeholder={txt.fullNamePlaceholder}
                        value={registerForm.name}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, name: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.email}</label>
                      <input
                        type="email"
                        className="marketlink-input"
                        placeholder={txt.emailPlaceholder}
                        value={registerForm.email}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, email: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Country */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.phoneFarmer}</label>
                      <input
                        type="tel"
                        className="marketlink-input"
                        placeholder={txt.phonePlaceholder}
                        value={registerForm.phone}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, phone: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.countryLabel}</label>
                      <select
                        className="marketlink-input"
                        value={registerForm.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        required
                      >
                        {COUNTRIES_CONFIG.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.code === 'PK' ? '🇵🇰 ' : c.code === 'SA' ? '🇸🇦 ' : '🇦🇪 '} {getCountryDisplayName(c.code)} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: City & Market Hub */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.cityLabel}</label>
                      <select
                        className="marketlink-input"
                        value={registerForm.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        required
                      >
                        {currentCountryCities.map((c) => (
                          <option key={c.name} value={c.name}>
                            {getCityDisplayName(c.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label d-flex justify-content-between align-items-center">
                        <span>
                          <i className="fa fa-store text-success me-1"></i>
                          {txt.marketLabel}
                        </span>
                        {availableCityMarkets.length > 0 && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                            {availableCityMarkets.length} {txt.bazarsIn} {getCityDisplayName(registerForm.city)}
                          </span>
                        )}
                      </label>
                      <select
                        className="marketlink-input"
                        value={registerForm.market_id}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, market_id: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      >
                        {availableCityMarkets.length > 0 ? (
                          <>
                            <option value="">{txt.selectMarketEmpty}</option>
                            {availableCityMarkets.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} &bull; ({Array.isArray(m.operatingDays) ? m.operatingDays.join(', ') : m.operatingDays}) - {m.location || m.address}
                              </option>
                            ))}
                          </>
                        ) : (
                          <>
                            <option value="">{txt.selectMarketEmpty}</option>
                            {marketsList
                              .filter(m => {
                                const mCountry = (m.country || '').toLowerCase().trim();
                                const mCountryCode = (m.countryCode || '').toLowerCase().trim();
                                return mCountry === currentCountryClean ||
                                       mCountryCode === currentCountryCode ||
                                       mCountry.includes(currentCountryClean);
                              })
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  [{getCityDisplayName(m.city || currentCountryConfig.defaultCity)}] {m.name} &bull; {m.location || m.address}
                                </option>
                              ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Farm Name & Stall Number */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.farmNameLabel}</label>
                      <input
                        type="text"
                        className="marketlink-input"
                        placeholder={txt.farmNamePlaceholder}
                        value={registerForm.farm_name}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, farm_name: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.stallNumberLabel}</label>
                      <input
                        type="text"
                        className="marketlink-input font-monospace text-uppercase"
                        placeholder={txt.stallNumberPlaceholder}
                        value={registerForm.stall_number}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, stall_number: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 5: Password & Confirm Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.password}</label>
                      <input
                        type="password"
                        className="marketlink-input"
                        placeholder={txt.passwordMinPlaceholder}
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                    <div className="marketlink-field-group">
                      <label className="marketlink-field-label">{txt.confirmPassword}</label>
                      <input
                        type="password"
                        className="marketlink-input"
                        placeholder={txt.confirmPasswordPlaceholder}
                        value={registerForm.password_confirmation}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password_confirmation: e.target.value });
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {renderRobotCaptcha()}

              <button
                type="submit"
                className="marketlink-submit-btn"
                disabled={loading}
              >
                {loading ? txt.creatingAccount : registerForm.role === 'farmer' ? txt.createFarmerBtn : txt.createCustomerBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
