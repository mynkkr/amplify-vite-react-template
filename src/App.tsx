// import React, { useState } from "react";
// import "./App.css";
// // import { uploadData } from "aws-amplify/storage";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import pako from "pako";  // Import pako for compression
// import Navbar from "./Navbar";
// import Jobsearch from "./Jobsearch.tsx";
// import logo from './assets/logo.png';
// const client = generateClient<Schema>();

// const App: React.FC = () => {
//     // State variables
//     const [url, setUrl] = useState("");
//     const [mainCharacterImage, setMainCharacterImage] = useState<File | null>(null);
//     const [logoImage, setLogoImage] = useState<File | null>(null);
//     const [instruction, setInstruction] = useState(""); // New state for genre
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);
//     const [aspectRatios, setAspectRatios] = useState({
//         "9:16": false,
//         "16:9": false,
//         "3:4": false,
//         "5:1": false,
//     });
//     const [showPopup, setShowPopup] = useState(false); // Popup visibility state
//     const [blurValue, setBlurValue] = useState(75); // New state for blur range (default is 75)

//     // Compress the byte array before uploading
//     // const compressByteArray = (byteArray: Uint8Array): Uint8Array => {
//     //     try {
//     //         const compressed = pako.deflate(byteArray);
//     //         console.log("Compressed byte array:", compressed);
//     //         return compressed;
//     //     } catch (error) {
//     //         console.error("Error during compression:", error);
//     //         throw new Error("Compression failed.");
//     //     }
//     // };

//     const convertToByteArray = (file: File | null): Promise<Uint8Array | null> => {
//         return new Promise((resolve, reject) => {
//             if (!file) {
//                 resolve(null);  // If no file, return null immediately
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 if (reader.result) {
//                     const byteArray = new Uint8Array(reader.result as ArrayBuffer);
//                     console.log("File successfully converted to byte array:", byteArray);
//                     resolve(byteArray);
//                 } else {
//                     reject(new Error("Failed to convert file to byte array"));
//                 }
//             };
//             reader.onerror = (error) => {
//                 console.error("Error reading file:", error);
//                 reject(new Error("Error reading file"));
//             };

//             console.log("Reading file:", file.name); // Log the file name for debugging
//             reader.readAsArrayBuffer(file);
//         });
//     };

//     const addToDDB = async (mainCharacterBuffer: Uint8Array | null, logoBuffer: Uint8Array | null) => {
//         try {
//             console.log("Preparing data for DDB:", {
//                 url,
//                 instruction,
//                 mainCharacterImageData: mainCharacterBuffer ? "[Compressed Binary Data]" : null,
//                 logoImageData: logoBuffer ? "[Compressed Binary Data]" : null,
//                 aspectRatios,
//                 blurValue,
//             });

//             const response = await client.models.Todo.create({
//                 content: JSON.stringify({
//                     url: url,
//                     instruction: instruction,
//                     mainCharacterImageData: mainCharacterBuffer ? mainCharacterBuffer : null,  // Ensure null values are handled
//                     logoImageData: logoBuffer ? logoBuffer : null,  // Ensure null values are handled
//                     aspectRatios: JSON.stringify(aspectRatios),  // Save selected aspect ratios
//                     blurValue: blurValue, // Save blur value
//                 }),
//             });

//             console.log("Successfully saved to DynamoDB:", response);
//             setShowPopup(true); // Show popup upon success
//         } catch (error) {
//             console.error("Error saving to DynamoDB:", error);
//             setMessage("Error saving data to DynamoDB.");
//         }
//     };

//     // Handle URL input change
//     const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setUrl(e.target.value);
//     };

//     // Handle Instruction input change
//     const handleInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInstruction(e.target.value);
//     };

//     // Handle file input changes for main character image
//     const handleMainCharacterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setMainCharacterImage(e.target.files[0]);
//         }
//     };

//     // Handle file input changes for logo image
//     const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setLogoImage(e.target.files[0]);
//         }
//     };

//     const handleAspectRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = e.target;
//         setAspectRatios((prev) => ({
//             ...prev,
//             [name]: checked,
//         }));
//     };

//     // Handle blur range slider change
//     const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setBlurValue(Number(e.target.value));
//     };

//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage(null);

//         if (!url) {
//             setMessage("Please fill in all required fields.");
//             setLoading(false);
//             return;
//         }

//         try {
//             // Convert to byte array only if images are uploaded
//             const mainCharacterBuffer = mainCharacterImage
//                 ? await convertToByteArray(mainCharacterImage)
//                 : null;

//             const logoBuffer = logoImage ? await convertToByteArray(logoImage) : null;

//             // Compress the byte arrays before sending to DynamoDB
//             // const compressedMainCharacterBuffer = mainCharacterBuffer ? compressByteArray(mainCharacterBuffer) : null;
//             // const compressedLogoBuffer = logoBuffer ? compressByteArray(logoBuffer) : null;

//             // Save to DynamoDB
//             await addToDDB(mainCharacterBuffer, logoBuffer);
//             setMessage(`Job submitted successfully, mail is sent to xxx@amazon.com.`);
//         } catch (error) {
//             console.error("Error uploading images:", error);
//             setMessage("Error uploading images.");
//         }

//         setLoading(false);
//     };

//     // Handle Popup Close
//     const handleClosePopup = () => {
//         setShowPopup(false);
//         // Reset form fields after submission
//         setUrl("");
//         setMainCharacterImage(null);
//         setLogoImage(null);
//         setInstruction("");
//         setAspectRatios({
//             "9:16": false,
//             "16:9": false,
//             "3:4": false,
//             "5:1": false,
//         });
//         setBlurValue(75); // Reset blur value to 75
//     };

//     return (
//         <Router>
//             <div className="App">
//                 {/* Navbar Component */}
//                 <Navbar/>

//                 <Routes>
//                     <Route
//                         path="/"
//                         element={
//                             <div >
//                                 <div className="logo-container">
//                                     <img src={logo} alt="App Logo" className="logo" />
//                                 </div>
//                                 <h1>RenAIssance: Artifact Generation Platform</h1>
//                                 <form onSubmit={handleSubmit}>
//                                     <div>
//                                         <label htmlFor="url">Enter Content URL for Artifact generation* </label>
//                                         <input
//                                             type="text"
//                                             id="url"
//                                             value={url}
//                                             onChange={handleUrlChange}
//                                             placeholder="Enter a URL"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label htmlFor="mainCharacterImage">Protagonist Character Image
//                                             (Optional) </label>
//                                         <text>Note: If this is provided, Screengrabs will contain the Protagonist
//                                             Image
//                                         </text>
//                                         <input
//                                             type="file"
//                                             id="mainCharacterImage"
//                                             onChange={handleMainCharacterImageChange}
//                                             accept="image/*"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label htmlFor="logoImage">Upload Logo Image (Optional) </label>
//                                         <input
//                                             type="file"
//                                             id="logoImage"
//                                             onChange={handleLogoImageChange}
//                                             accept="image/*"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label>Choose Aspect Ratio (Optional)</label>
//                                         <div className="checkbox-container">
//                                             <div>
//                                                 <input
//                                                     type="checkbox"
//                                                     id="9:16"
//                                                     name="9:16"
//                                                     checked={aspectRatios["9:16"]}
//                                                     onChange={handleAspectRatioChange}
//                                                 />
//                                                 <label htmlFor="9:16">9:16</label>
//                                             </div>
//                                             <div>
//                                                 <input
//                                                     type="checkbox"
//                                                     id="16:9"
//                                                     name="16:9"
//                                                     checked={aspectRatios["16:9"]}
//                                                     onChange={handleAspectRatioChange}
//                                                 />
//                                                 <label htmlFor="16:9">16:9</label>
//                                             </div>
//                                             <div>
//                                                 <input
//                                                     type="checkbox"
//                                                     id="3:4"
//                                                     name="3:4"
//                                                     checked={aspectRatios["3:4"]}
//                                                     onChange={handleAspectRatioChange}
//                                                     disabled
//                                                 />
//                                                 <label htmlFor="3:4" className="faded">3:4</label>
//                                             </div>
//                                             <div>
//                                                 <input
//                                                     type="checkbox"
//                                                     id="5:1"
//                                                     name="5:1"
//                                                     checked={aspectRatios["5:1"]}
//                                                     onChange={handleAspectRatioChange}
//                                                     disabled
//                                                 />
//                                                 <label htmlFor="5:1" className="faded">5:1</label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="instruction">Instruction for shortlisting of images to the AI
//                                             agent </label>
//                                         <input
//                                             type="text"
//                                             id="instruction"
//                                             value={instruction}
//                                             onChange={handleInstructionChange}
//                                             placeholder="Enter an instruction (Optional)"
//                                         />

//                                         <text>
//                                             Sample Instruction 1: Please shortlist top 10 images which matches Romantic
//                                             Comedy Genre
//                                         </text>
//                                         <text>
//                                             Sample Instruction 2: Please shortlist top 5 images which are most vibrant
//                                             and colorful
//                                         </text>
//                                     </div>

//                                     <div className="blur-slider-container">
//                                         <label htmlFor="blur">Blur Amount (0 to 150)</label>
//                                         <input
//                                             type="range"
//                                             id="blur"
//                                             min="0"
//                                             max="150"
//                                             value={blurValue}
//                                             onChange={handleBlurChange}
//                                         />
//                                         <div className="blur-value">{blurValue}</div>
//                                     </div>


//                                     <button type="submit" disabled={loading}>
//                                         {loading ? "Uploading..." : "Submit"}
//                                     </button>
//                                 </form>

//                                 {message && <p>{message}</p>}

//                                 {/* Success Popup */}
//                                 {showPopup && (
//                                     <div className="popup">
//                                         <div className="popup-content">
//                                             <h2>Success!</h2>
//                                             <p>Your job has been successfully submitted!</p>
//                                             <button onClick={handleClosePopup}>OK</button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         }
//                     />

//                     <Route
//                         path="/status"
//                         element={
//                             <div>
//                                 <div className="logo-container">
//                                    <img src={logo} alt="App Logo" className="logo" />
//                                 </div>
//                                 <h1>RenAIssance: Artifact Generation Platform</h1>
//                                 <h1>Job Status</h1>

//                                 <Jobsearch/>
//                             </div>
//                         }
//                     />

//                     <Route
//                         path="/gallery"
//                         element={
//                             <div>
//                                 <div className="logo-container">
//                                     <img src={logo} alt="App Logo" className="logo" />
//                                 </div>
//                                 <h1>RenAIssance: Artifact Generation Platform</h1>
//                                 <h1>Album</h1>
//                                 <p>This is Page 3 content.</p>
//                             </div>
//                         }
//                     />
//                 </Routes>
//             </div>
//         </Router>

//     );
// };
// export default App;

import React, { useState } from "react";
import "./App.css";
// import { uploadData } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import pako from "pako";  // Import pako for compression
import Navbar from "./Navbar";
import Jobsearch from "./Jobsearch.tsx";
import logo from './assets/logo.png';
import Gallery from "./Gallery.tsx";
const client = generateClient<Schema>();

const App: React.FC = () => {
    // State variables
    const [url, setUrl] = useState("");
    const [mainCharacterImages, setMainCharacterImages] = useState<File[]>([]); // Store multiple protagonist images
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [instruction, setInstruction] = useState(""); // New state for genre
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [aspectRatios, setAspectRatios] = useState({
        "9:16": false,
        "16:9": false,
        "2:3": false,
        "3:4": false,
        "5:1": false,
    });
    const [showPopup, setShowPopup] = useState(false); // Popup visibility state
    const [blurValue, setBlurValue] = useState(75); // New state for blur range (default is 75)

    // Compress the byte array before uploading
    // const compressByteArray = (byteArray: Uint8Array): Uint8Array => {
    //     try {
    //         const compressed = pako.deflate(byteArray);
    //         console.log("Compressed byte array:", compressed);
    //         return compressed;
    //     } catch (error) {
    //         console.error("Error during compression:", error);
    //         throw new Error("Compression failed.");
    //     }
    // };

    const convertToByteArray = (files: File[]): Promise<Uint8Array[]> => {
        return Promise.all(
            files.map(file =>
                new Promise<Uint8Array>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (reader.result) {
                            resolve(new Uint8Array(reader.result as ArrayBuffer));
                        } else {
                            reject(new Error("Failed to convert file to byte array"));
                        }
                    };
                    reader.onerror = (error) => {
                console.error("Error reading file:", error);
                reject(new Error("Error reading file"));
            };
                    reader.readAsArrayBuffer(file);
                })
            )
        );
    };


    const addToDDB = async (mainCharacterBuffers: Uint8Array[] | null, logoBuffer: Uint8Array[] | null) => {
        try {
            console.log("Preparing data for DDB:", {
                url,
                instruction,
                mainCharacterImageData: mainCharacterBuffers ? "[Compressed Binary Data]" : null,
                logoImageData: logoBuffer ? "[Compressed Binary Data]" : null,
                aspectRatios,
                blurValue,
            });

            const response = await client.models.Todo.create({
                content: JSON.stringify({
                    url: url,
                    instruction: instruction,
                    mainCharacterImageData: mainCharacterBuffers ? mainCharacterBuffers : null,  // Ensure null values are handled
                    logoImageData: logoBuffer ? logoBuffer : null,
                    aspectRatios: JSON.stringify(aspectRatios),
                    blurValue: blurValue,
                }),
            });

            console.log("Successfully saved to DynamoDB:", response);
            setShowPopup(true); // Show popup upon success
        } catch (error) {
            console.error("Error saving to DynamoDB:", error);
            setMessage("Error saving data to DynamoDB.");
        }
    };


    // Handle URL input change
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    // Handle Instruction input change
    const handleInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstruction(e.target.value);
    };

    // Handle file input changes for main character image
    const handleMainCharacterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files); // Convert FileList to an array
            setMainCharacterImages(files); // Update state with the array of files
        }
    };


    // Handle file input changes for logo image
    const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoImage(e.target.files[0]);
        }
    };

    const handleAspectRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setAspectRatios((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    // Handle blur range slider change
    const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlurValue(Number(e.target.value));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!url) {
            setMessage("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            // Convert to byte array only if images are uploaded
            const mainCharacterBuffers = mainCharacterImages.length
                ? await convertToByteArray(mainCharacterImages)
                : null;

            const logoBuffer = logoImage ? await convertToByteArray([logoImage]) : null;

            // Save to DynamoDB
            await addToDDB(mainCharacterBuffers, logoBuffer);
            setMessage(`Job submitted successfully, mail is sent to xxx@amazon.com.`);
        } catch (error) {
            console.error("Error uploading images:", error);
            setMessage("Error uploading images.");
        }

        setLoading(false);
    };


    // Handle Popup Close
    const handleClosePopup = () => {
        setShowPopup(false);
        // Reset form fields after submission
        setUrl("");
        setMainCharacterImages([]);
        setLogoImage(null);
        setInstruction("");
        setAspectRatios({
            "9:16": false,
            "16:9": false,
            "2:3": false,
            "3:4": false,
            "5:1": false,
        });
        setBlurValue(75); // Reset blur value to 75
    };

    return (
        <Router>
            <div className="App">
                {/* Navbar Component */}
                <Navbar/>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <div >
                                <div className="logo-container">
                                    <img src={logo} alt="App Logo" className="logo" />
                                </div>
                                <h1>RenAIssance: Artifact Generation Platform</h1>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="url">Enter Content URL for Artifact generation* </label>
                                        <input
                                            type="text"
                                            id="url"
                                            value={url}
                                            onChange={handleUrlChange}
                                            placeholder="Enter a URL"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="mainCharacterImage">Protagonist Character Image
                                            (Optional) </label>
                                        <text>Note: If this is provided, Screengrabs will contain the Protagonist
                                            Image
                                        </text>
                                        <input
                                            type="file"
                                            id="mainCharacterImage"
                                            onChange={handleMainCharacterImageChange}
                                            accept="image/*"
                                            multiple
                                        />


                                    </div>

                                    <div>
                                        <label htmlFor="logoImage">Upload Logo Image (Optional) </label>
                                        <input
                                            type="file"
                                            id="logoImage"
                                            onChange={handleLogoImageChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div>
                                        <label>Choose Aspect Ratio (Optional)</label>
                                        <div className="checkbox-container">
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="9:16"
                                                    name="9:16"
                                                    checked={aspectRatios["9:16"]}
                                                    onChange={handleAspectRatioChange}
                                                />
                                                <label htmlFor="9:16">9:16</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="16:9"
                                                    name="16:9"
                                                    checked={aspectRatios["16:9"]}
                                                    onChange={handleAspectRatioChange}
                                                />
                                                <label htmlFor="16:9">16:9</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="2:3"
                                                    name="2:3"
                                                    checked={aspectRatios["2:3"]}
                                                    onChange={handleAspectRatioChange}
                                                />
                                                <label htmlFor="2:3">2:3</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="3:4"
                                                    name="3:4"
                                                    checked={aspectRatios["3:4"]}
                                                    onChange={handleAspectRatioChange}
                                                    disabled
                                                />
                                                <label htmlFor="3:4" className="faded">3:4</label>
                                            </div>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    id="5:1"
                                                    name="5:1"
                                                    checked={aspectRatios["5:1"]}
                                                    onChange={handleAspectRatioChange}
                                                    disabled
                                                />
                                                <label htmlFor="5:1" className="faded">5:1</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="instruction">Instruction for shortlisting of images to the AI
                                            agent </label>
                                        <input
                                            type="text"
                                            id="instruction"
                                            value={instruction}
                                            onChange={handleInstructionChange}
                                            placeholder="Enter an instruction (Optional)"
                                        />

                                        <text>
                                            Sample Instruction 1: Please shortlist top 10 images which matches Romantic
                                            Comedy Genre
                                        </text>
                                        <text>
                                            Sample Instruction 2: Please shortlist top 5 images which are most vibrant
                                            and colorful
                                        </text>
                                    </div>

                                    <div className="blur-slider-container">
                                        <label htmlFor="blur">Blur Amount (0 to 150)</label>
                                        <input
                                            type="range"
                                            id="blur"
                                            min="0"
                                            max="150"
                                            value={blurValue}
                                            onChange={handleBlurChange}
                                        />
                                        <div className="blur-value">{blurValue}</div>
                                    </div>


                                    <button type="submit" disabled={loading}>
                                        {loading ? "Uploading..." : "Submit"}
                                    </button>
                                </form>

                                {message && <p>{message}</p>}

                                {/* Success Popup */}
                                {showPopup && (
                                    <div className="popup">
                                        <div className="popup-content">
                                            <h2>Success!</h2>
                                            <p>Your job has been successfully submitted!</p>
                                            <button onClick={handleClosePopup}>OK</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />

                    <Route
                        path="/status"
                        element={
                            <div>
                                <div className="logo-container">
                                    <img src={logo} alt="App Logo" className="logo" />
                                </div>
                                <h1>RenAIssance: Artifact Generation Platform</h1>
                                <h1>Job Status</h1>

                                <Jobsearch/>
                            </div>
                        }
                    />

                    <Route
                        path="/gallery"
                        element={
                            <div>
                                <div className="logo-container">
                                    <img src={logo} alt="App Logo" className="logo" />
                                </div>
                                <h1>RenAIssance: Artifact Generation Platform</h1>
                                <h1>Album</h1>
                                <p>This is Page 3 content.</p>
                                <Gallery/>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>

    );
};

export default App;
