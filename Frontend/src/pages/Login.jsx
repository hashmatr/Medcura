import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { BackendURL, token, setToken, isLoading } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Forget password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Redirect if already logged in - wait for auth loading to complete
  useEffect(() => {
    if (!isLoading && token) {
      navigate('/');
    }
  }, [token, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#5F6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const { data } = await axios.post(`${BackendURL}/api/user/register`, {
          name,
          password,
          email
        });
        if (data.success) {
          setToken(data.token); // This will automatically update localStorage via context
          toast.success('Registered Successfully');
          // Don't navigate here - let the useEffect handle it
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${BackendURL}/api/user/login`, {
          password,
          email
        });
        if (data.success) {
          setToken(data.token); // This will automatically update localStorage via context
          toast.success('Logged in Successfully');
          // Don't navigate here - let the useEffect handle it
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BackendURL}/api/user/forgot-password`, {
        email: forgotEmail
      });
      if (data.success) {
        toast.success(data.message);
        setShowForgotPassword(false);
        setShowOTPVerification(true);
        setOtpTimer(300); // 5 minutes timer
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BackendURL}/api/user/verify-otp`, {
        email: forgotEmail,
        otp
      });
      if (data.success) {
        toast.success(data.message);
        setResetToken(data.resetToken);
        setShowOTPVerification(false);
        setShowResetPassword(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BackendURL}/api/user/reset-password`, {
        resetToken,
        newPassword
      });
      if (data.success) {
        toast.success(data.message);
        resetForgotPasswordStates();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${BackendURL}/api/user/resend-otp`, {
        email: forgotEmail
      });
      if (data.success) {
        toast.success(data.message);
        setOtpTimer(300);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resending OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForgotPasswordStates = () => {
    setShowForgotPassword(false);
    setShowOTPVerification(false);
    setShowResetPassword(false);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setOtpTimer(0);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName("");
    setEmail("");
    setPassword("");
    resetForgotPasswordStates();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Forgot Password Form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Forgot Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email address to receive an OTP
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5F6FFF] cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-[#5F6FFF]/90 h-10 px-4 py-2 w-full mt-6"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Form
  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Verify OTP
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code sent to {forgotEmail}
              </p>
              {otpTimer > 0 && (
                <p className="text-sm text-[#5F6FFF] mt-2">
                  OTP expires in: {formatTime(otpTimer)}
                </p>
              )}
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-foreground"
                >
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="bg-[#5F6FFF] cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-[#5F6FFF]/90 h-10 px-4 py-2 w-full mt-6"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div className="text-center mt-6 space-y-2">
              {otpTimer === 0 ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="text-sm text-[#5F6FFF] hover:underline disabled:opacity-50"
                >
                  {isSubmitting ? "Resending..." : "Resend OTP"}
                </button>
              ) : null}
              <div>
                <button
                  type="button"
                  onClick={resetForgotPasswordStates}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 8}
                className="bg-[#5F6FFF] cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-[#5F6FFF]/90 h-10 px-4 py-2 w-full mt-6"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={resetForgotPasswordStates}
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Login/Signup Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Login"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp
                ? "Please sign up to book appointment"
                : "Please log in to book appointment"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={name}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#5F6FFF] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5F6FFF] cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-[#5F6FFF]/90 h-10 px-4 py-2 w-full mt-6"
            >
              {isSubmitting ? 
                (isSignUp ? "Creating account..." : "Logging in...") :
                (isSignUp ? "Create account" : "Login")
              }
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#5F6FFF] hover:underline font-medium"
              >
                {isSignUp ? "Login here" : "Sign up here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;