import React, { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import './Jobsearch.css'
const client = generateClient<Schema>();

const Jobsearch: React.FC = () => {
    const [searchId, setSearchId] = useState("");  // State for the search query
    const [searchResult, setSearchResult] = useState<any | null>(null);  // State for the search result
    const [loading, setLoading] = useState(false);  // Loading state for searching
    const [error, setError] = useState<string | null>(null);  // State for handling errors

    // Function to handle ID search in DynamoDB
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSearchResult(null);

        if (!searchId) {
            setError("Please enter a valid ID.");
            setLoading(false);
            return;
        }

        try {
            const { data: todo, errors } = await client.models.Todo.get({
                id: searchId,
            });

            if (errors) {
                setError("An error occurred while searching.");
                console.error(errors);
            } else if (todo) {
                // Ensure content is not null before parsing
                const content = todo.content ? JSON.parse(todo.content) : null;

                if (content) {
                    // Only extract the id and url from the content
                    setSearchResult({
                        id: todo.id,
                        url: content.url,
                    });
                } else {
                    setError("Content is empty or invalid.");
                }
            } else {
                setError("No record found with this ID.");
            }
        } catch (error) {
            console.error("Error searching DynamoDB:", error);
            setError("An error occurred while searching.");
        }

        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="searchId">Search by Job ID:</label>
                    <input
                        type="text"
                        id="searchId"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter Item Job ID"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {/* Display results or error */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {searchResult && (
                <div className="search-result" style={{ marginTop: "20px" }}>
                    <h3>Search Result</h3>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div><strong>ID:</strong> {searchResult.id}</div>
                        <div><strong>URL:</strong> {searchResult.url}</div>
                        <div><strong>Job Status:</strong> Running</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobsearch;
