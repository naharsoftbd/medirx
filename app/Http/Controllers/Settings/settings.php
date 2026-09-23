<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});

Route::prefix('admin')->middleware('auth', 'role:Admin')->group(function () {
    Route::prefix('settings/system')->name('settings.system.')->group(function () {
        Route::get('/', [SystemSettngsController::class, 'index'])->name('index');
        Route::get('/general/edit', [SystemSettngsController::class, 'editGeneralSettings'])->name('general.edit');
        Route::post('/general/update', [SystemSettngsController::class, 'updateGeneralSettings'])->name('general.update');
        Route::get('/site-identity/edit', [SystemSettngsController::class, 'editSiteIdentitySettings'])->name('site_identity.edit');
        Route::post('/site-identity/update', [SystemSettngsController::class, 'updateSiteIdentitySettings'])->name('site_identity.update');
        Route::get('/color/edit', [SystemSettngsController::class, 'editColorSettings'])->name('color.edit');
        Route::post('/color/update', [SystemSettngsController::class, 'updateColorSettings'])->name('color.update');
        Route::get('/seo/edit', [SystemSettngsController::class, 'editSeoSettings'])->name('seo.edit');
        Route::post('/seo/update', [SystemSettngsController::class, 'updateSeoSettings'])->name('seo.update');
        Route::get('/systemconfig', [SystemSettngsController::class, 'systemConfiguration'])->name('systemconfig.index');
        Route::get('/cachesettings', [SystemSettngsController::class, 'cacheSettings'])->name('cachesettings.index');
        Route::get('/routecachesettings', [SystemSettngsController::class, 'clearRouteCachSettings'])->name('routecachesettings.clear');
        Route::get('/viewcachesettings', [SystemSettngsController::class, 'clearViewCachSettings'])->name('viewcachesettings.clear');
        Route::get('/configcachesettings', [SystemSettngsController::class, 'clearConfigCachSettings'])->name('configcachesettings.clear');
        Route::get('/eventcachesettings', [SystemSettngsController::class, 'clearEventCachSettings'])->name('eventcachesettings.clear');
        Route::get('/allcachesettings', [SystemSettngsController::class, 'clearAllCachSettings'])->name('allcachesettings.clear');
        Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
        Route::post('/backup/database', [BackupController::class, 'database'])->name('backup.database');
        Route::get('/backup/database/download', [BackupController::class, 'getDownloadDatabase'])->name('backup.database.download');
        Route::delete('/backup/database', [BackupController::class, 'deleteBackup'])->name('backup.database.delete');
    });

    // ----------------------
    // FRONTEND SETTINGS GROUP
    // ----------------------
    Route::prefix('settings/frontend')
        ->name('settings.frontend.')
        ->group(function () {
            // General frontend settings
            Route::get('/', [ManageFrontendSettingsController::class, 'index'])->name('index');

            // Department section
            Route::controller(ManageFrontendSettingsController::class)->group(function () {
                Route::get('/department', 'getDepartment')->name('department');
                Route::post('/department', 'updateDepartmentHeading')->name('department.update');
                Route::post('/toggle-homepage-department', 'toggleHomepageDepartment')->name('department.toggle');

                // Doctor section
                Route::get('/doctor', 'getDoctorSettings')->name('doctor');
                Route::post('/doctor', 'updateDoctorSettings')->name('doctor.update');
                Route::post('/toggle-homepage-doctors', 'toggleHomepageDoctor')->name('doctor.toggle');

                // Featured Doctor section
                Route::get('/featureddoctor', 'getFeaturedDoctorSettings')->name('featureddoctor');
                Route::post('/featureddoctor', 'updateFeaturedDoctorSettings')->name('featureddoctor.update');
                Route::post('/toggle-homepage-feature', 'toggleHomepageFeature')->name('feature.toggle');

                // FAQ section
                Route::get('/faq', 'getFaqSettings')->name('faq');
                Route::post('/faq', 'updateFaqSettings')->name('faq.update');
                Route::post('/toggle-homepage-faq', 'toggleHomepageFaq')->name('faq.toggle');

                // Partner section
                Route::get('/partner', 'getPartnerSettings')->name('partner');
                Route::post('/partner', 'updatePartnerSettings')->name('partner.update');
                Route::post('/toggle-homepage-partner', 'toggleHomepagePartner')->name('partner.toggle');

                // Testimonial section
                Route::get('/testimonial', 'getTestimonialSettings')->name('testimonial');
                Route::post('/testimonial', 'updateTestimonialSettings')->name('testimonial.update');
                Route::post('/toggle-homepage-testimonial', 'toggleHomepageTestimonial')->name('testimonial.toggle');

                // Blog section
                Route::get('/blog', 'getBlogSettings')->name('blog');
                Route::post('/blog', 'updateBlogSettings')->name('blog.update');
                Route::post('/toggle-homepage-blog', 'toggleHomepageBlog')->name('blog.toggle');
            });

            // Homepage toggles for banner
            Route::post('/toggle-homepage-banner', [BannerController::class, 'toggleHomepageBanner'])->name('banner.toggle');
        });

    // ----------------------
    // EMAIL TEMPLATE SETTINGS
    // ----------------------
    Route::prefix('settings')
        ->middleware(['auth', 'verified', 'role:Admin'])
        ->group(function () {
            // ----------------------
            // RESOURCE ROUTES GROUPS
            // ----------------------
            Route::resource('banners', BannerController::class)->except(['update']);
            Route::resource('faqs', FAQController::class);
            Route::resource('partners', PartnerController::class)->except(['update']);
            Route::resource('testimonials', TestimonialController::class)->except(['update']);
            Route::resource('email-templates', EmailTemplateController::class);

            // Additional POST routes for updating via custom endpoints
            Route::post('banners/update/{banner}', [BannerController::class, 'update'])->name('banners.update');
            Route::post('partners/update/{partner}', [PartnerController::class, 'update'])->name('partners.update');
            Route::post('testimonials/update/{testimonial}', [TestimonialController::class, 'update'])->name('testimonials.update');
        });
});
