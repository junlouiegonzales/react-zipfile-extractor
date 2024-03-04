import React, { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DraftIcon from "@mui/icons-material/DraftsOutlined";
import { ZipFile } from "./common/types";
import JSZip from "jszip";
import _ from "lodash";
import { saveAs } from "file-saver";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
  directory: "",
});

const App = () => {
  const [zipFiles, setZipFiles] = useState<ZipFile[]>();
  const [fileData, setFileData] = useState<File>();
  const [isCompleted, setIsCompleted] = useState(false);

  const getFileIcon = (name: string | undefined) => {
    if (!name) return;
    switch (name.split(".").pop()) {
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
      case "gif":
        return (
          <ImageIcon
            color="disabled"
            style={{ height: "20px", width: "20px" }}
          />
        );
      case "pdf":
        return (
          <PictureAsPdfIcon
            color="disabled"
            style={{ height: "20px", width: "20px" }}
          />
        );
      case "txt":
        return (
          <DraftIcon
            color="disabled"
            style={{ height: "20px", width: "20px" }}
          />
        );
      default:
        return (
          <FolderIcon
            color="disabled"
            style={{ height: "20px", width: "20px" }}
          />
        );
    }
  };

  return (
    <div className="App">
      <Grid
        height="100vh"
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        bgcolor="gray"
      >
        <Card sx={{ minWidth: 500 }}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              textAlign="left"
            >
              Extract file
            </Typography>

            {isCompleted && (
              <Stack mt={3} direction="row" alignItems="center" gap={1}>
                <Typography textAlign="left" color="gray" fontSize="regular">
                  Download completed!
                </Typography>
                <CheckIcon color="success" />
              </Stack>
            )}

            {zipFiles && zipFiles.length > 1 ? (
              <Box mt={4}>
                <TableContainer>
                  <Table size="small" aria-label="Dense Table">
                    <TableBody>
                      {zipFiles.map((file) => (
                        <TableRow
                          key={file.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ paddingLeft: 0 }}
                          >
                            <Stack direction="row" alignItems="center" gap={1}>
                              {getFileIcon(file.name)}
                              {file.name}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Stack direction="row" gap={1} mt={4}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setZipFiles([]);
                        setFileData(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      component="label"
                      variant="contained"
                      onClick={() => {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (fileData) {
                            saveAs(fileData, fileData?.name);
                          }
                        };
                        reader.onloadend = () => {
                          setIsCompleted(true);
                          setZipFiles([]);
                          setFileData(undefined);
                        };
                        if (fileData) {
                          reader.readAsDataURL(fileData);
                        }
                      }}
                    >
                      Extract
                    </Button>
                  </Stack>
                </TableContainer>
              </Box>
            ) : (
              <Box
                padding={4}
                border="1px dashed #f2f2f2"
                mt={4}
                textAlign="center"
              >
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Browse file (.zip)
                  <VisuallyHiddenInput
                    type="file"
                    accept=".zip,.rar,.7z,.gz"
                    onChange={async (e) => {
                      setIsCompleted(false);
                      if (e.target.files && e.target.files.length >= 1) {
                        const file = e.target.files[0];
                        const jsZip = new JSZip();
                        jsZip.loadAsync(file).then((zip) => {
                          const files = _.values(zip.files)
                            .sort((a, b) => {
                              if (a.name.toUpperCase() < b.name.toUpperCase())
                                return -1;
                              if (a.name.toUpperCase() > b.name.toUpperCase())
                                return 1;
                              return 0;
                            })
                            .map((t) => {
                              return {
                                name: t.name,
                                date: t.date,
                              };
                            });
                          setZipFiles(files);
                          setFileData(file);
                        });
                      }
                    }}
                  />
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default App;

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}
