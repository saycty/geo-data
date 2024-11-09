/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Table, Pagination } from "react-bootstrap";
import { uploadFile, getRequest, baseUrl } from "../utils/services";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const filesPerPage = 5; // Define the number of files per page

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getRequest(baseUrl + "/upload", {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("User")).token
          }`,
        });
        setFiles(response ? response : []);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0]; // Get the file from the input element

    try {
      const response = await uploadFile(file);
      if (response.error) {
        setError(response.message);
      } else {
        setFiles([...files, { name: file.name, type: file.type }]);
        fileInput.value = ""; // Clear the file input on successful upload
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleView = (file) => {
    navigate(`/mapbox/${file.type}/${file._id}`);
  };

  // Calculate the files to display for the current page
  const indexOfLastFile = page * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const paginatedFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  // Handle page change
  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <>
      <h2 className="text-center">Upload File</h2>
      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Upload a file</Form.Label>
          <Form.Control type="file" id="fileInput" />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button
          type="submit"
          variant="primary"
          style={{ marginBottom: "1rem" }}
        >
          Upload
        </Button>
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFiles.length > 0 ? (
            paginatedFiles.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>
                  <Button variant="primary" onClick={() => handleView(file)}>
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No files uploaded
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pages Controls */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        />
        {[...Array(Math.ceil(files.length / filesPerPage)).keys()].map(
          (num) => (
            <Pagination.Item
              key={num + 1}
              active={num + 1 === page}
              onClick={() => handlePageChange(num + 1)}
            >
              {num + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(files.length / filesPerPage)}
        />
      </Pagination>
    </>
  );
};

export default Dashboard;
