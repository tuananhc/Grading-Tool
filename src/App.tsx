import React from 'react';
import { useState } from 'react';
import {
  Alert,
  Box,
  IconButton,
  Modal,
  Typography,
  Slide,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

interface ListItem {
  id: number,
  content: string
}

export default function App() {
  const [data, setData] = useState<ListItem[]>([]);
  const [copyAlertOpen, setCopyAlertOpen] = useState<boolean>(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
  const [itemCount, setItemCount] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function addItem() {
    setData([...data, { id: itemCount, content: "New Item" }])
    setItemCount(itemCount => itemCount + 1);
  }

  function handleItemContentChange(itemId: number, newContent: string) {
    let newData = data.map(item => {
      if (item.id !== itemId) return item;
      return { id: itemId, content: newContent }
    })

    setData(newData);
  }

  function removeItem(itemId: number) {
    setData(data => data.filter((item)=> item.id !== itemId ))
  }

  function popUpCopyAlert() {
    setCopyAlertOpen(true);
    setTimeout(() => setCopyAlertOpen(false), 2000)
  }

  function popUpDeleteAlert() {
    setDeleteAlertOpen(true);
    setTimeout(() => setDeleteAlertOpen(false), 2000)
  }

  return (
    <div className="App" style={{ display: "flex" }}>
      <Box sx={{
        margin: 10, 
        display: "flex",
        flexDirection: "column",
        flex: 1
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton 
            aria-label="linkedin" 
            onClick={() => {
              window.open("https://www.linkedin.com/in/anhc/", '_blank');
            }}
            >
            <LinkedInIcon color="primary"/>
          </IconButton>
          <IconButton 
            aria-label="github" 
            sx={{ marginLeft: 2 }}
            onClick={() => {
              window.open("https://github.com/tuananhc", '_blank');
            }}
          >
            <GitHubIcon color="primary"/>
          </IconButton>
          <IconButton 
            aria-label="instagram" 
            sx={{ marginLeft: 2, marginRight: 4 }}
            onClick={() => {
              window.open("https://www.instagram.com/anh_chaau/", '_blank');
            }}
          >
            <InstagramIcon color="primary"/>
          </IconButton>
          <Typography variant="body2" color="primary">
            Created by Anh Cháu out of boredom and spite :D
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Typography variant="h2">
            Anh Cháu's grading tool lmao
          </Typography>
          <IconButton 
            aria-label="info" 
            sx={{ marginLeft: 2 }}
            onClick={() => {
              setModalOpen(true)
            }}
          >
            <InfoOutlinedIcon color="primary"/>
          </IconButton>
        </Box>

        <Box sx={{
          display: "flex",
          maxWidth: 1500
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 0.5 }}>
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5
            }}>
              <Typography variant="h5">
                Add new item
              </Typography>
              <IconButton 
                aria-label="add" 
                size="large" 
                sx={{ marginLeft: 2}}
                onClick={addItem}
              >
                <AddIcon color="primary"/>
              </IconButton>
            </Box>
            {data.map((item, i) => {
              return <Item 
              key={i}
              id={item.id} 
              item={item.content} 
              copyPopUpAlert={popUpCopyAlert}
              deletePopUpAlert={popUpDeleteAlert}
              onChange={handleItemContentChange}
              onRemove={removeItem}
              />
            })}
          </Box>

          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            flex: 0.5, 
            paddingLeft: 6,
            paddingTop: 4,
          }}>
            <TextField 
              label="Notes"
              fullWidth
              multiline
              focused
              variant="filled"
              sx={{ 
                borderRadius: 2,
                "& .MuiInputBase-input": {
                  color: 'blue', fontFamily: "monospace", whiteSpace: "pre", paddingTop: 2
                },
                "& .MuiFormLabel-root": {
                  color: 'blue', fontFamily: "monospace", whiteSpace: "pre", fontSize: 20
                }
              }}
              rows={20}
            />
          </Box>
        </Box>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
          }}>
            <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ paddingBottom: 2 }}>
              Mah grading tool
            </Typography>
            <Typography variant="h6">
              Write prompts ahead of time and just copy and paste during marking.
            </Typography>
            <Typography variant="h6">
              Any items can be editted, copied or deleted at any time.
            </Typography>
            <Typography variant="h6">
              Use the note box to free up RAM in your brain.
            </Typography>
          </Box>
        </Modal>

        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          left: "50%",
          bottom: 20,
          transform: "translate(-50%, -50%)",
          margin: "0 auto"
        }}>
          <Slide direction="up" in={copyAlertOpen} mountOnEnter unmountOnExit>
            <Alert 
              icon={<CheckIcon fontSize="inherit" />} 
              severity="success" 
              sx={{ width: "fit-content" }}
            >
              Copied content to clipboard.
            </Alert>
          </Slide>
          <Slide direction="up" in={deleteAlertOpen} mountOnEnter unmountOnExit>
            <Alert 
              icon={<CheckIcon fontSize="inherit" />} 
              severity="error" 
              sx={{ width: "fit-content", zIndex: 2 }}
            >
              Deleted Item.
            </Alert>
          </Slide>
        </Box>
      </Box>
    </div>
  );
}

function Item(props: any) {
  const [isEditing, setEditing] = useState(false);

  return <Box sx={{ 
    margin: "5px 0",
    padding: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }}>
    <Box sx={{ 
      display: "flex", 
      flex: 1, 
      justifyContent: "space-between",
      borderBottom: "1px solid black",
      paddingBottom: 2,
    }}>
      <Box 
        onClick={() => setEditing(true)} 
        onBlur={() => setEditing(false)}
        sx={{
          display: "flex", 
          flex: 1, 
          alignItems: "center"
        }}
      >
        { isEditing 
        ? 
          <TextField 
            defaultValue={props.item} 
            variant="standard"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              props.onChange(props.id, event.target.value);
            }}
            fullWidth
          />
        : 
          <Typography>{props.item}</Typography>
        }
      </Box>
      <Box>
        <IconButton 
          aria-label="copy" 
          sx={{ marginLeft: 2 }}
          onClick={() => {
            navigator.clipboard.writeText(props.item);
            props.copyPopUpAlert();
          }}
        >
          <ContentCopyIcon color="primary"/>
        </IconButton>
        <IconButton 
          aria-label="delete" 
          onClick={() => {
            props.onRemove(props.id)
            props.deletePopUpAlert();
          }}
        >
          <DeleteOutlineOutlinedIcon color="primary"/>
        </IconButton>
      </Box>
    </Box>

  </Box>
}