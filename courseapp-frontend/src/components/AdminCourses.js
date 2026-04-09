// src/components/AdminCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Form, Button, ListGroup, Card, Alert, Row, Col } from 'react-bootstrap';

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });
    const [editingCourse, setEditingCourse] = useState(null);

    const { user } = useAuth();
    const isAdmin = user && user.role === 'ADMIN';

    useEffect(() => {
        if (!isAdmin) {
            setError("You do not have administrative privileges.");
            setLoading(false);
            return;
        }
        fetchCourses();
    }, [isAdmin]);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/courses');
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: value });
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post('http://localhost:8080/api/courses', newCourse);
            setNewCourse({ title: '', description: '' });
            fetchCourses();
        } catch (err) {
            console.error("Error adding course:", err);
            setError("Failed to add course.");
        }
    };

    const handleDeleteCourse = async (id) => {
        setError(null);
        try {
            await axios.delete(`http://localhost:8080/api/courses/${id}`);
            fetchCourses();
        } catch (err) {
            console.error("Error deleting course:", err);
            setError("Failed to delete course.");
        }
    };

    const handleEditClick = (course) => {
        setEditingCourse(course);
        setNewCourse({ title: course.title, description: course.description });
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setError(null);
        if (!editingCourse) return;

        try {
            await axios.put(`http://localhost:8080/api/courses/${editingCourse.id}`, newCourse);
            setNewCourse({ title: '', description: '' });
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            console.error("Error updating course:", err);
            setError("Failed to update course.");
        }
    };

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!isAdmin) {
        return <Alert variant="danger">Access Denied: You must be an ADMIN to manage courses.</Alert>;
    }

    return (
        <div>
            <h1 className="mb-4">Admin Course Management</h1>

            <Card className="mb-4 p-3">
                <h2 className="mb-3">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                <Form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
                    <Form.Group className="mb-3" controlId="formCourseTitle">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={newCourse.title}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formCourseDescription">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={newCourse.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="me-2">
                        {editingCourse ? 'Update Course' : 'Add Course'}
                    </Button>
                    {editingCourse && (
                        <Button variant="secondary" type="button" onClick={() => {
                            setEditingCourse(null);
                            setNewCourse({ title: '', description: '' });
                        }}>
                            Cancel Edit
                        </Button>
                    )}
                </Form>
            </Card>

            <h2 className="mb-3">Current Courses</h2>
            {courses.length === 0 ? (
                <p>No courses available.</p>
            ) : (
                <ListGroup>
                    {courses.map(course => (
                        <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{course.title}</h5>
                                <p className="mb-0">{course.description}</p>
                            </div>
                            <div>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(course)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}

export default AdminCourses;