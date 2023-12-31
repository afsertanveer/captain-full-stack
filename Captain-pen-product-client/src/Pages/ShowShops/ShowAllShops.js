import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";

const ShowAllShops = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [subD, setSubD] = useState([]);
  const [users,setUsers] = useState([]);
  const [srs,setSrs] = useState([]);
  const [singleShop,setSingleShop] = useState({});
  const [pagiNationData,setPagiNationData] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      fetch(
        `http://localhost:5000/paginated-shops?page=${clickedPage}`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data) => {
       setShops(data.shopdata);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    } else {
      fetch(
        `http://localhost:5000/paginated-shops?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
       setShops(data.shopdata);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  const  assignSr = e =>{
    e.preventDefault();
    const assigned = e.target.sr.value;
    const shop={
      assigned
    }
    console.log(singleShop);
    fetch(`http://localhost:5000/assign-sr-shop/${singleShop._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(shop)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("SR Added")
        window.location.reload(false);
      }
    }).catch(err=>console.log(err));
  }
  const editShop  = e =>{
    e.preventDefault();
    const form   = e.target;
    const shop_name = form.shop_name.value;
    const contact_no = form.contact_no.value;
    const address = form.address.value;
    const owner_name = form.owner_name.value;
    const managed_by = form.srshop.value;
    const shop={
      shop_name,contact_no,address,owner_name,managed_by
    }
    console.log(shop);
    fetch(`http://localhost:5000/shop/${singleShop._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(shop)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Shop Edited Successfully")
        window.location.reload(false);
      }
    }).catch(err=>console.log(err));

  }
  useEffect(() => {
    setIsLoading(true);
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setUsers(data);
        setSrs(data.filter(d=>d.role==='3'));
        setIsLoading(false);
    }).catch(err=>console.log(err));
    fetch("http://localhost:5000/paginated-shops?page=1", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setShops(data.shopdata);
        setPagiNationData(data.paginateData);
        setIsLoading(false);
    }).catch(err=>console.log(err));


    fetch("http://localhost:5000/district", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setDistrict(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));

    fetch("http://localhost:5000/subdistrict", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setSubD(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));

    fetch("http://localhost:5000/thana", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setThana(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));
  }, [username, role, navigate]);
  return (
    <div>
      {
        isLoading && <Loader></Loader>
      }
      <div className="text-center my-6">
        <p className="text-4xl font-bold">All shops</p>
      </div>
      <div className='overflow-x-auto w-full'>
            <table className='mx-auto   w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Contact Number</th>
              <th>Owner Name</th>
              <th>Division</th>
              <th>District</th>
              <th>Upozilla/Thana</th>
              <th>Managed By</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {shops.length > 0 &&
              shops.map((it) => (
                <tr key={it._id}>
                  <td>{it.shop_name}</td>
                  <td>{it.contact_no}</td>
                  <td>{it.owner_name}</td>
                  <td>{it.division}</td>
                  <td>
                    {district.length > 0 &&
                      district.filter((ds) => ds.value === it.district_id)[0]
                        .label}
                  </td>
                  <td>
                    {
                    it.thana? (thana?.length>0 && thana?.filter(th=>th.value===it.thana)[0]?.label) : (subD?.length>0 && subD?.filter(sub=>sub.value===it.subdistrict)[0].label)
                    
                    }
                  </td>
                  <td>{it.managed_by===''?  <label htmlFor="edit-modal" onClick={()=>setSingleShop(it)} className="ml-4 btn bg-green-900 text-white">
                        Assign SR
                      </label>
                      :
                       users.filter(u=>u._id===it.managed_by)[0]?.name}
                  </td>
                  <td>
                  <label htmlFor="edit-shop" onClick={()=>setSingleShop(it)} className="ml-4 btn bg-green-900 text-white">
                        Edit Shop
                      </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
        <input type="checkbox" id="edit-shop" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={editShop}>
        <p className="text-2xl text-center  font-bold">Add Shop</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Shop Name</span>
          </label>
          <input
            type="text"
            name="shop_name"
            placeholder="Name"
            defaultValue={singleShop.shop_name}
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Contact Number</span>
          </label>
          <input
            type="text"
            name="contact_no"
            placeholder="Phone"
            defaultValue={singleShop.contact_no}
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Address</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            defaultValue={singleShop.address}
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Owner's Name</span>
          </label>
          <input
            type="text"
            name="owner_name"
            placeholder="Owner's Name"
            defaultValue={singleShop.owner_name}
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Assign SR</span>
            </label>
            <select
              name="srshop"
              className=" input input-bordered w-full lg:w-1/2 mb-4"
              
            >
              <option></option>
              {srs.length > 0 &&
                srs.map((sr) => (
                  singleShop.region_id===sr.region_id && <option key={sr._id} value={sr._id} 
                    selected={singleShop.managed_by===sr._id}
                  >
                    {sr.name}
                  </option>
                ))}
            </select>
          </div>
        <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Edit Shop"
                  className="btn w-[150px]"
                />
                
              <label htmlFor="edit-shop" className="btn bg-red-600 ">
              Close
              </label>
              </div>
            </div>
      </form>
         
        </div>
      </div>
        <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={assignSr}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Assign SR</span>
            </label>
            <select
              name="sr"
              className=" input input-bordered w-full lg:w-1/2 mb-4"
            >
              <option></option>
              {srs.length > 0 &&
                srs.map((sr) => (
                  <option key={sr._id} value={sr._id}>
                    {sr.name}
                  </option>
                ))}
            </select>
          </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="ADD SR"
                  className="btn w-[150px]"
                />
                
              <label htmlFor="edit-modal" className="btn bg-red-600 ">
              Close
              </label>
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </div>
  );
};

export default ShowAllShops;
