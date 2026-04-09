import { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Card, Alert } from 'react-bootstrap';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/courses");
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to fetch courses. Please log in.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (courses.length === 0) {
        return <div>No courses found.</div>;
    }

    return (
        <div>
            <h1 className="mb-4">Courses</h1>
            <ListGroup>
                {courses.map(course => (
                    <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{course.title}</h5>
                            <p className="mb-0">{course.description}</p>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
