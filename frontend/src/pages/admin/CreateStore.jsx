import { useState } from "react";

import { createStore } from "../../services/storeService";

import toast from "react-hot-toast";

function CreateStore() {

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    ownerId: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createStore(formData);

      toast.success("Store Created Successfully");

    } catch (error) {

      toast.error(error.response.data.message);

    }
  };

  return (

    <div className="create-store">

      <form className="store-form" onSubmit={handleSubmit}>

        <h1>Create Store</h1>

        <input
          type="text"
          name="name"
          placeholder="Store Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Store Address"
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Store Description"
          onChange={handleChange}
        />

        <input
          type="number"
          name="ownerId"
          placeholder="Owner ID"
          onChange={handleChange}
        />

        <button>
          Create Store
        </button>

      </form>

    </div>
  );
}

export default CreateStore;