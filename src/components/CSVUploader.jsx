import React, { useState } from 'react';
import { Button, Input, VStack, useToast } from '@chakra-ui/react';
import Papa from 'papaparse';

const CSVUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please select a CSV file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onUpload(results.data);
      },
      error: (error) => {
        toast({
          title: "Error parsing file.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <VStack spacing={4}>
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleUpload} colorScheme="blue">Upload CSV</Button>
    </VStack>
  );
};

export default CSVUploader;