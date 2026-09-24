<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CreateUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Models\Setting;
use App\Models\User;
use App\Services\Auth\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $recordsPerPage = Setting::getValue('records_per_page', 10);
        $perPage = $request->input('per_page', $recordsPerPage);
        $search = null;
        $role = null;

        if ($request->filled('search')) {
            $search = $request->search;
        }

        if ($request->filled('role')) {
            $role = $request->role;
        }

        $users = $this->userService->paginate($search, $perPage, $role);

        return Inertia::render('Admin/Users/index', [
            'users'   => $users,
            'roles'   => Role::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['search', 'per_page', 'role']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUserRequest $request)
    {
        $data = $request->validated();

        $user = $this->userService->create($data);

        event(new Registered($user));

        return redirect()->route('users.index')->with(['success' => 'User Created Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = $this->userService->find($id);
        $user->load([
            'roles',
        ]);

        return Inertia::render('Admin/Users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = $this->userService->find($id);

        return Inertia::render('Admin/Users/edit', [
            'user'      => $user,
            'userRoles' => $user->roles()->pluck('name'),
            'roles'     => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        $user = $this->userService->update($data, $user);

        return redirect()->route('users.index')->with(['success' => 'User Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $this->userService->delete($id);

        return redirect()->route('users.index')->with(['success' => 'User Deleted Successfully']);
    }
}
