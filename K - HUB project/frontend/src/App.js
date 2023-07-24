import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

                const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));

                setFilteredData(filteredData);
                setError(null);
            } catch (error) {
                setError("Error processing the file. Please ensure it's a valid Excel file.");
                setFilteredData(null);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const renderCharts = () => {
        if (filteredData) {
            const columns = Object.keys(filteredData[0]);

            const barTraces = columns.map((column) => ({
                x: columns,
                y: filteredData.map((item) => item[column]),
                type: 'bar',
                name: column,
            }));

            const pieTrace = {
                labels: columns,
                values: columns.map((column) => filteredData.reduce((acc, item) => acc + (item[column] ? 1 : 0), 0)),
                type: 'pie',
                name: 'Pie Chart',
            };

            return ( <
                div className = "charts-container" >
                <
                div className = "chart-item" >
                <
                h2 > Bar Graph < /h2> <
                Plot data = { barTraces }
                layout = {
                    { barmode: 'group' }
                }
                /> < /
                div > <
                div className = "chart-item" >
                <
                h2 > Pie Chart < /h2> <
                Plot data = {
                    [pieTrace]
                }
                layout = {
                    { title: 'Pie Chart' }
                }
                /> < /
                div > <
                /div>
            );
        }
    };

    return ( <
        div className = "app-container" >
        <
        h1 className = "app-title" > K - Hub Data Analysis < /h1> <
        Dropzone onDrop = { handleFileUpload } > {
            ({ getRootProps, getInputProps }) => ( <
                div {...getRootProps() }
                className = "dropzone" >
                <
                input {...getInputProps() }
                /> <
                p > Drag and drop a file here or click to select one < /p> {
                uploadedFile && < p className = "file-info" > File selected: { uploadedFile.name } < /p>} {
                error && < p className = "error" > { error } < /p>} < /
                div >
            )
        } <
        /Dropzone> { filteredData && renderCharts() } < /
        div >
    );
}

export default App;