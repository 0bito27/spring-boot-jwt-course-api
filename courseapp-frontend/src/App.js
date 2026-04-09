import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Courses from './Courses';
import Login from './components/Login';
import Register from './components/Register';
import AdminCourses from './components/AdminCourses';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar as RBNavbar, Nav, Container, Button } from 'react-bootstrap';


function Navbar() {
    const { isLoggedIn, logout, user } = useAuth();

    return (
        <RBNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <RBNavbar.Brand as={Link} to="/">CourseApp</RBNavbar.Brand>
                <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
                <RBNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {isLoggedIn && <Nav.Link as={Link} to="/courses">Courses</Nav.Link>}
                        {isLoggedIn && user?.role === 'ADMIN' && (
                            <Nav.Link as={Link} to="/admin/courses">Manage Courses</Nav.Link>
                        )}
                    </Nav>
                    <Nav> {/* Linkovi na desnoj strani */}
                        {isLoggedIn ? (
                            <>
                                <span className="nav-link text-light me-2">Welcome, {user?.username || 'User'}!</span>
                                <Button variant="outline-light" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </RBNavbar.Collapse>
            </Container>
        </RBNavbar>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Container className="my-4">
                    <Routes>
                        <Route path="/" element={<h2>Welcome to CourseApp <br/> – Your Path to Knowledge! Learn, grow, and advance! Our platform allows you to explore various courses, enhance your skills, and achieve your goals. Whether you want to master programming, design, marketing, or any other field, you’ll find high-quality lessons and expert mentors here. Join a community of learners who are building their future step by step. Learning has never been easier – start today!</h2>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/admin/courses" element={<AdminCourses />} />
                        </Route>

                        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                    </Routes>
                </Container>
            </AuthProvider>
        </Router>
    );
}

export default App;

