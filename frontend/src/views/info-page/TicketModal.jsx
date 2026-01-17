import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  ModalCloseButton,
  Select,
  Box,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import FilePicker from "../../components/filePicker/FilePicker.jsx";
import PropTypes from "prop-types";

function SendTicketForm(values) {
  fetch("http://localhost:3000/tickets", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  }).then(async (res) => {
    // eslint-disable-next-line no-unused-vars
    const parsedResponse = JSON.parse(await res.text());
  });
}

export function TicketModal({ isOpen, onClose, onOpen, id }) {
  const { mutate, isLoading } = useMutation((variable) =>
    SendTicketForm(variable)
  );

  const [showPicker, setShowPicker] = useState(false);
  const [myFiles, setMyFiles] = useState([]);

  useEffect(() => {
    const localFiles = JSON.parse(localStorage.getItem("myFiles"));
    if (!localFiles || localFiles.length < 1) {
      localStorage.setItem("myFiles", "[]");
    } else {
      setMyFiles(localFiles);
    }
  }, []);

  const onSubmit = (values, { setSubmitting }) => {
    const updatedValues = {
      ...values,
      buildingId: Number(values.buildingId),
      userId: Number(values.userId),
      docs: myFiles
        .map((item) => item.url)
        .filter((item) => item !== undefined)[0],
    };
    mutate(updatedValues);
    setSubmitting(false);
  };
  const userId = localStorage.getItem("userId");

  // Append strings to 'docs'

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxH="700px" maxW="1000px">
        <Box p="6" letterSpacing="wide" fontSize="xs" ml="2">
          <Formik
            initialValues={{
              title: "",
              description: "",
              category: "",
              docs: "",
              buildingId: parseInt(id, 10),
              userId: parseInt(userId, 10),
            }}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <>
                  <ModalHeader textAlign="center">
                    Care este problema?
                  </ModalHeader>

                  <FormControl isInvalid={!!errors.title && touched.title}>
                    <FormLabel>Titlu</FormLabel>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      type="title"
                      variant="filled"
                      validate={(value) => {
                        let error;

                        if (value === "") {
                          error = "Title can't be empty";
                        }

                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Id</FormLabel>
                    <Field
                      as={Input}
                      id="id"
                      name="id"
                      type="text"
                      isDisabled
                      defaultValue={`#${id}`}
                    />
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.category && touched.category}
                  >
                    <FormLabel>Categorie</FormLabel>
                    <Field
                      as={Select}
                      id="category"
                      name="category"
                      type="select"
                      maxW="200px"
                      placeholder="Selecteaza categoria"
                      validate={(value) => {
                        let error;

                        if (value === "") {
                          error = "Select a category";
                        }
                        return error;
                      }}
                    >
                      <option value="categorie1">Locatie invalida</option>
                      <option value="categorie2">Informatii gresite</option>
                      <option value="categorie3">Actualizare expert</option>
                      <option value="categorie4">Altele</option>
                    </Field>
                    <FormErrorMessage>{errors.category}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.description && touched.description}
                  >
                    <FormLabel>Descriere problema</FormLabel>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      type="description"
                      variant="filled"
                      height="200"
                      validate={(value) => {
                        let error;
                        if (value === "") {
                          error = "Description can't be empty";
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>

                  <ModalCloseButton />
                  <HStack mt="3" spacing="700">
                    <Button
                      colorScheme="pink"
                      onClick={() => setShowPicker(!showPicker)}
                    >
                      Incarca(.pdf, .jpg)
                    </Button>

                    {showPicker && (
                      <FilePicker
                        setShowPicker={setShowPicker}
                        setMyFiles={setMyFiles}
                      ></FilePicker>
                    )}

                    <Button
                      colorScheme="teal"
                      type="submit"
                      isLoading={isLoading}
                      onClick={onClose}
                    >
                      Trimite
                    </Button>
                  </HStack>
                </>
              </form>
            )}
          </Formik>
        </Box>
      </ModalContent>
    </Modal>
  );
}

TicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
