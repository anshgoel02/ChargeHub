import User from '../models/user.js';

export const registerForm = (req, res) => {
    res.render('users/register');
}

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to ChargeHub');
            res.redirect('/chargers');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}

export const loginForm = (req, res) => {
    res.render('users/login');
}

export const loginUser = async (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}`);
    const redirectUrl = req.session.returnTo || '/chargers';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

export const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/chargers');
    });
}