import React, { useState } from "react";
import { Container, VStack, Button, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { useCSVReader } from "react-papaparse";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";

const Index = () => {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleUpload = (results) => {
    const [headerRow, ...rows] = results.data;
    setHeaders(headerRow);
    setData(rows);
  };

  const handleAddRow = () => {
    setData([...data, Array(headers.length).fill("")]);
  };

  const handleRemoveRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleChange = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value;
    setData(newData);
  };

  const handleDownload = () => {
    const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <CSVReader onUploadAccepted={(results) => handleUpload(results)}>
          {({ getRootProps, acceptedFile }) => (
            <>
              <Button {...getRootProps()} colorScheme="teal" size="lg">
                {acceptedFile ? acceptedFile.name : "Upload CSV"}
              </Button>
            </>
          )}
        </CSVReader>
        {data.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header, index) => (
                    <Th key={index}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <Td key={colIndex}>
                        <Input value={cell} onChange={(e) => handleChange(e, rowIndex, colIndex)} />
                      </Td>
                    ))}
                    <Td>
                      <Button colorScheme="red" size="sm" onClick={() => handleRemoveRow(rowIndex)}>
                        <FaTrash />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} colorScheme="green" onClick={handleDownload}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;