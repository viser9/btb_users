import React from "react";
import Particle from "./Particle";
import { ethers } from 'ethers';
import abi from "./artifacts/contracts/Complain.sol/Complain.json"
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css"
import "./style.css"
import { Button } from "@mui/material";
import { toast, Toaster } from "react-hot-toast";

export default function App() {
  const appStyle = {
    background: "orange",
    padding: "20px",
    textAlign: "center",
  };
  const [state,setState] =  React.useState({
    address : null,
    provider : null,
    signer : null,
    contract : null
  });
  const [candidates, setCandidates] = React.useState([])
  const [votes, setVotes] = React.useState([])

  React.useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const contractabi = abi.abi;
      try {
        const { ethereum } = window;
    
        if (ethereum) {
          const account = await ethereum.request({ method: "eth_requestAccounts" });
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(contractAddress, contractabi, signer);
        const count = await contract.candidateCount()
        console.log("Candidate Count ", count.toString())
        setState({ address, provider, signer, contract });
        let candidatesArr = [];
        let votesArr = [];
        for(let i = 1; i <= count; i++) {
          const candidate = await contract.candidates(i)
          const votes  = await contract.votes(i)
          console.log("Votes ",votes.toString())
          console.log(candidate)
          let candidate_obj = {
            name: candidate[0],
            party: candidate[1],
            imageUri: candidate[2],
          }
          candidatesArr.push(candidate_obj)
                  votesArr.push(votes.toString()) 
        }
        setCandidates(candidatesArr)
        setVotes(votesArr)
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  async function castVote(index) {
    try{
      const transaction = await state.contract.vote(index,2);
      await transaction.wait();
      toast.success("Voted Successfully");
      console.log(transaction);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%',flexWrap:'wrap' }}>
      {/* Left Section (70%) */}
      <div style={{ flex: '70%', overflow: 'auto' }}>
        <Particle />
        <Typography variant="h4" align="center" style={{ color: 'white',paddingTop:50 }}>
          CAST YOUR VOTE
        </Typography>
        <Box sx={{ my: 10, display: 'flex', justifyContent: "center", flexWrap: 'wrap' }}>
          {candidates.map((item, index) => (
            <div key={index} style={{ marginBottom: '3rem'}}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  border: 1,
                  borderRadius: 3,
                  background: "#ffffff",
                  width: "90%",
                  opacity: "70%",
                }}
              >
                <img
                  src={item.imageUri}
                  alt={item.name}
                  style={{
                    width: '15rem',
                    height: '10rem',
                    marginLeft: '2rem',
                    marginRight: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '30px'
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 0, marginRight: 5, width: '130px' }}>
                  <div><b>NAME  : </b>{item.name}</div>
                  <div><b>PARTY : </b>{item.party}</div>
                  <div><b>Total Votes : </b>{votes[index]}</div>
                  <div>{index}</div>
                  <Button variant="contained" sx={{mt:2,bgcolor: '#e16327',color:'white','&:hover': {
                    bgcolor: '#363333'}}} 
                   onClick={() => castVote(index+1)}>
                   Vote
                  </Button>
                </Box>
              </Box>
            </div>
          ))}
        </Box>
      </div>

      {/* Right Section (30%) */}
      <div style={{ flex: '25%', backgroundColor: '#f0f0f0',marginTop:450,paddingBottom:20, padding: '10px',marginRight:'20px',opacity:"80%",height:150 }}>
      <div>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Name
        </p>
        <p style={{ fontSize: '16px' }}>
          Address : {state.address}
        </p>
      </div>
      </div>
      <Toaster toastOptions={{ duration: 4000 }} />
    </div>
  );
};