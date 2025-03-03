import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Sidebar } from "primereact/sidebar";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".zip",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.downloadUrl.endsWith(".zip")) {
        setDownloadUrl(response.data.downloadUrl);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRowClick = () => {
    searchParams.set("_panelOpen", true);
    setSearchParams(searchParams);
  };

  const diseaseData = {
    name: "Citrus greening",
    description: "Citrus greening, also known as Huanglongbing (HLB), is a devastating disease of citrus caused by the bacterium Candidatus Liberibacter asiaticus. It is one of the most serious citrus plant diseases in the world."
  }; 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full flex justify-between items-center px-[8vw] bg-orange-100 border-b">
        <div className="px-4 py-2">
            <img src="favicons/favicon.ico" alt="Logo" className="" />
        </div>
        <div className="px-4 py-2 h-24" onClick={handleRowClick}>
            <img src="images/orange-fruit.png" alt="Logo" className="object-cover h-full spin-horizontal" />
        </div>
      </nav>

      <div className="text-center my-8 px-[8vw]">
        <h1 className="text-[2rem] font-bold mb-4 text-orange-600">AI-Powered Orange Disease Detection tool</h1>
        <p className="text-gray-600 text-[1.2rem]">
          Drag and drop or click to upload an orange image you would love to analyse, then Our AI engine will process and 
          analyse the image offering you feedback in the side panel on your right.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div
          {...getRootProps()}
          className="w-[90vw] md:w-[50vw] border-2 border-dashed py-16 rounded-lg cursor-pointer bg-white text-center shadow-sm"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 text-md font-medium">Drop the ZIP file here...</p>
          ) : (
            <p className="text-gray-600 text-md">Drag & drop a ZIP file here, or click to select</p>
          )}
        </div>

        {selectedFile && (
          <p className="mt-2 text-sm text-gray-700 font-medium">Selected: {selectedFile.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`mt-4 px-4 py-2 rounded-lg ${
            selectedFile && !isUploading ? "bg-orange-600 text-white" : "bg-orange-100 text-gray-500 cursor-not-allowed"
          }`}
          title={!selectedFile ? "Please select a file" : ""}
        >
          {isUploading ? "Uploading..." : "Upload & Generate"}
        </button>
      </div>

      <div className="mt-16 flex justify-center items-center space-x-3 text-xs text-gray-600">
        <span className="flex items-center">
          <span className="bg-orange-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">1</span>
          <span className="ml-1">Upload image</span>
        </span>
        <span className="text-gray-400">→</span>
        <span className="flex items-center">
          <span className="bg-orange-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">2</span>
          <span className="ml-1">AI Processes</span>
        </span>
        <span className="text-gray-400">→</span>
        <span className="flex items-center">
          <span className="bg-orange-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">3</span>
          <span className="ml-1">View feedback</span>
        </span>
      </div>

      <Sidebar 
        visible={searchParams.get('_panelOpen') === 'true'} 
        onHide={() => {
          searchParams.set("_panelOpen",  false );
          setSearchParams(searchParams)
        }} 
        position="right" 
        className="w-full md:w-[33vw] p-0"
        content={({ hide }) => (
          <div className="p-5 h-[100vh] overflow-y-auto">
            <section className='flex justify-between items-center sticky -top-5 bg-white z-10'>
              <h2 className="text-xl font-bold text-orange-600">Feedback details</h2>
              <i className="pi pi-times text-orange-600" onClick={() => hide()}/>
            </section>

            <section className="mt-4">
              <h3 className="text-lg font-bold text-orange-600">Image uploaded</h3>
              <img src="images/orange-fruit.png" alt="Orange fruit" className="w-full" />
            </section>

            <section className="mt-4">
              <h3 className="text-lg font-bold text-orange-600">Disease detected</h3>
              <p className="text-gray-600">Citrus greening</p>
            </section>

            <section>
              <pre>
                { 
                  'name: "Citrus greening",'
                  + 'description: "Citrus greening, also known as Huanglongbing (HLB), is a devastating disease of citrus caused by the bacterium Candidatus Liberibacter asiaticus. Citrus greening is one of the most serious citrus plant diseases in the world. It is also known as Huanglongbing (HLB) or yellow shoot disease. The disease'
                }"
              </pre>
            </section>
            
          </div>
        )}
      />
    </div>
  );
};

export default Home;