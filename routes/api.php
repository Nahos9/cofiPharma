// Routes d'administration
Route::middleware(['auth:sanctum', 'checkrole:admin'])->prefix('admin')->group(function () {
    Route::apiResource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::get('roles', function () {
        return \App\Models\Role::all();
    });
});
