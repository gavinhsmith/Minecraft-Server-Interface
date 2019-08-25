new PlayerCounter({
    ip: '96.60.13.193',
    format: '{online}/{max}',
    refreshRate: 30 * 1000,
    element: document.getElementById('users_online')
});