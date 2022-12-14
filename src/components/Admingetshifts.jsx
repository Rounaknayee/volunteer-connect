import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios';
import { rooturl,loader } from '../config';

function Admingetshifts() {

    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [color, setColor] = useState('red');
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');

    const handlesearch = (e) => {
        console.log(e.target.value);
        setSearch(e.target.value);
    }

    // const data = {
        



    const fetchShifts = async () => {
        try {
            const response = await axios(rooturl + '/admin/getshifts',
             {
                method: 'GET',
                credentials: 'include',
                headers:{
                    'x-access-token': localStorage.getItem('token'),
                    }
                
            })

            const data = response.data.shifts;
            console.log(data);
            // console.log("processed data")

            if (response.status === 200 && data.length > 0) {
                setLoading(false);  
                console.log("data length > 0")
                setShifts(data);
                setMessage("");
                }
            else if (response.status === 200 && data.length === 0) {
                setShifts([]);
                setLoading(false);
                setMessage("No shifts witin the system, Please Add shifts!");
                }
            else {
                console.log("error");
                setMessage("error");
            }
        } catch (error) {
            console.log(error);
            setMessage("Error in Try Block");
        }
        
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    const handledeleteshift = async(id) => {
        try{
            const response = await axios(rooturl + `/admin/deleteshift/${id}`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers:{
                    'x-access-token': localStorage.getItem('token'),
                    }
            })
            console.log(response);
            if (response.status === 200) {
                setShifts(shifts.filter(shift => shift.id !== id));
                setColor('green');
                setMessage("Shift Deleted Successfully");
                }
            else if(response.status === 401){

                setMessage("Invalid Delete Request");
            }
            else {
                console.log("error");
                setMessage("Error Deleteing Shift");
            }
        }
        catch(error){
            console.log(error);
            setMessage("Error in Try Block");
        }
    }

  return (
    <div>
    {loading? loader:(<>
    <div className='text-center text-2xl font-bold text-green-600 my-2'>
        Shifts </div>
    <div className="flex flex-row align-left my-2">
        <input 
        type="text"
        placeholder="Search"
        value={search}
        onChange={handlesearch}
        className="border border-blue-400 text-blue-600 w-1/2 p-2"
        />
    </div>
    <table 
    class="table-auto border border-blue-400  w-90">
    
        
      <thead 
        class="border border-blue-400  w-full align-middle"
      >
          <tr>
                <th
                className="border border-blue-400  w-1/12 p-2"
                >Shift ID</th>

                <th
                className="border border-blue-400  w-1/12 p-2"
                >Start Time</th>

                <th
                className="border border-blue-400  w-1/1 p-2"
                >End Time</th>

                <th
                className="border border-blue-400  w-1/12 p-2"
                >Max Volunteers</th>

                <th
                className="border border-blue-400  w-1/12 p-2"
                >Work Type</th>

                <th
                className="border border-blue-400  w-3/12 p-2"
                >Location</th>

                <th
                className="border border-blue-400  w-3/12 p-2"
                >Description</th>

                <th
                className="border border-blue-400  w-1/12 p-2"
                >Delete shift</th>
                
          </tr>
      </thead>
        <tbody>
            {shifts.length > 0 ?(
            shifts.filter(shift =>
                shift.description.toLowerCase().includes(search.toLocaleLowerCase()) ||
                shift.location.toLowerCase().includes(search.toLocaleLowerCase()) ||
                shift.work_type.toLowerCase().includes(search.toLocaleLowerCase()) ||
                shift.start_time.toString().includes(search.toLocaleLowerCase()) ||
                shift.end_time.toString().includes(search.toLocaleLowerCase()) ||
                shift.max_volunteers.toString().includes(search.toLocaleLowerCase()) 
                ).map((shift) => (
                    
                    
                <>
                <tr
                className='border border-blue-400  w-full align-center'
                >
                    <td
                    className='border border-blue-400  w-1/12 p-2 text-center'
                    >{shift.id}</td>
                    <td
                    className='w-1/12 p-2 text-center'
                    >{shift.start_time}{ console.log(shift)}</td>
                    <td
                    className='w-1/12 p-2   text-center'
                    >{shift.end_time}</td>
                    <td
                    className='w-1/12 p-2 text-center'
                    >{shift.max_volunteers}</td>
                    <td
                    className='w-1/12 p-2   text-center'
                    >{shift.work_type}</td>
                    <td
                    className='w-2/12 p-2   text-center'
                    >{shift.location}</td>
                    <td
                    className='w-2/12 p-2  text-center'
                    >{shift.description}</td>

                    <td
                    className='w-1/12 p-2 text-center'
                    >
                    <button class="bg-red-500 hover:bg-white hover:text-red-500 hover:border hover:border-red-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handledeleteshift(shift.id)}>
                    Delete
                    </button></td>
                </tr>
                </>
            )))
            :
            <tr >
                <td colspan = {6}>No shifts assigned to user yet!</td>
            </tr>
            }
        </tbody>

    </table>
    </>)}

    {message ? 
    <div className={`bg-${color}-100 border border-${color}-400 text-${color}-700  px-4 py-3 rounded relative`}>
    <p class="font-bold">{message}</p> 
    </div> : null}

    </div>
  )
}

export default Admingetshifts