const check_login = document.getElementById('check_login');

if (localStorage.msi_loggedin == String(true)) {
	check_login.style.display = 'block';
} else {
	window.location.href = '/?from=lrerr';
};