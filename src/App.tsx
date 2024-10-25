import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Alert,
  Box,
  IconButton,
  Modal,
  Typography,
  Slide,
  TextField,
  Tabs,
  Tab,
  useMediaQuery,
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function getInitialData(): ListItem[] {
  var data = localStorage.getItem("data");
  if (!data) {
    return [];
  } 
  
  return JSON.parse(data);
}

function getInitialNotes(): string {
  var notes = localStorage.getItem("notes");
  if (!notes) {
    return "";
  } 
  
  return notes;
}

// TODO: store session content in a cookie?
export default function App() {
  const [data, setData] = useState<ListItem[]>(getInitialData());
  const [notes, setNotes] = useState<string>(getInitialNotes());
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

  function removeAllItem() {
    setData([]);
  }

  function popUpCopyAlert() {
    setCopyAlertOpen(true);
    setTimeout(() => setCopyAlertOpen(false), 2000)
  }

  function popUpDeleteAlert() {
    setDeleteAlertOpen(true);
    setTimeout(() => setDeleteAlertOpen(false), 2000)
  }

  function removeAllNotes() {
    setNotes("");
  }

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem("notes", notes); 
  }, [data, notes])

  return (
    <div className="App" style={{ display: "flex" }}>
      <Box sx={{
        margin: 10, 
        display: "flex",
        flexDirection: "column",
        flex: 1
      }}>
        <HeaderAndContact setModalOpen={setModalOpen}/>

        <ComponentsRenderedOnWindowSize 
          data={data}
          notes={notes}
          setNotes={setNotes}
          addItem={addItem}
          popUpCopyAlert={popUpCopyAlert}
          popUpDeleteAlert={popUpDeleteAlert}
          onChange={handleItemContentChange}
          removeItem={removeItem}
          removeAllItem={removeAllItem}
          removeAllNotes={removeAllNotes}
        />
        
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

function HeaderAndContact(props: any) {
  return (
    <Box>
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
          props.setModalOpen(true)
        }}
      >
        <InfoOutlinedIcon color="primary"/>
      </IconButton>
    </Box>
  </Box>

  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ComponentsRenderedOnWindowSize(props: any) {
  const matches = useMediaQuery('(min-width:1000px)');
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (matches) {
    return (
      <Box sx={{
        display: "flex",
        maxWidth: 1500
      }}>
        <ItemList 
          data={props.data}
          addItem={props.addItem}
          popUpCopyAlert={props.popUpCopyAlert}
          popUpDeleteAlert={props.popUpDeleteAlert}
          onChange={props.onChange}
          removeItem={props.removeItem}
          removeAllItem={props.removeAllItem}
        />
        <NoteBox 
          notes={props.notes} 
          setNotes={props.setNotes}
          removeAllNotes={props.removeAllNotes}
          popUpDeleteAlert={props.popUpDeleteAlert}
        />
      </Box>
    )
  } else {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="basic tabs example" 
            variant="fullWidth"
          >
            <Tab label="Items" {...a11yProps(0)} />
            <Tab label="Notes" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ItemList 
            data={props.data}
            addItem={props.addItem}
            popUpCopyAlert={props.popUpCopyAlert}
            popUpDeleteAlert={props.popUpDeleteAlert}
            onChange={props.onChange}
            removeItem={props.removeItem}
            removeAllItem={props.removeAllItem}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <NoteBox 
            notes={props.notes} 
            setNotes={props.setNotes}
            removeAllNotes={props.removeAllNotes}
            popUpDeleteAlert={props.popUpDeleteAlert}
          />
        </CustomTabPanel>
      </Box>
    );
  }

}
 
function ItemList(props: any) {
  return (
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
          onClick={props.addItem}
          >
          <AddIcon color="primary"/>
        </IconButton>
        <IconButton 
          aria-label="delete" 
          onClick={() => {
            props.removeAllItem();
            props.popUpDeleteAlert();
          }}
        >
          <DeleteOutlineOutlinedIcon color="primary"/>
        </IconButton>
      </Box>
      <>
        {props.data.map((item: any, i: number) => {
          return <Item 
            key={i}
            id={item.id} 
            item={item.content} 
            copyPopUpAlert={props.popUpCopyAlert}
            deletePopUpAlert={props.popUpDeleteAlert}
            onChange={props.onChange}
            onRemove={props.removeItem}
          />
        })}
      </>
    </Box>
  )
}

function NoteBox(props: any) {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      flex: 0.5, 
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2
      }}>
        <Typography variant="h5">
          Notes
        </Typography>
        <IconButton 
          aria-label="delete" 
          size="large"
          onClick={() => {
            props.removeAllNotes();
            props.popUpDeleteAlert();
          }}
        >
          <DeleteOutlineOutlinedIcon color="primary"/>
        </IconButton>
      </Box>
      <TextField 
        fullWidth
        multiline
        focused
        value={props.notes}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          props.setNotes(event.target.value);
        }}
        variant="filled"
        sx={{ 
          borderRadius: 2,
          "& .MuiInputBase-input": {
            color: 'blue', fontFamily: "monospace", whiteSpace: "pre",
          },
          "& .MuiFormLabel-root": {
            color: 'blue', fontFamily: "monospace", whiteSpace: "pre", fontSize: 20
          }
        }}
        rows={20}
      />
    </Box>
  )
}