import React, { useEffect, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import { db } from "../../firebase/firebase.config";
const Write = () => {
  const [name, setName] = useState("");
  const [definition, setDefinition] = useState("");
  const [fruits, setFruits] = useState([]);

  // write in firebase database
  const handleSubmitData = async () => {
    const newDocRef = push(ref(db, "nature/fruits"));
    set(newDocRef, {
      fruitsName: name,
      fruitsDefinition: definition,
    })
      .then(() => {
        alert("Data saved successfully");
      })
      .catch((error) => {
        alert("Oops! Error found: ", error.message);
      });

    setName("");
    setDefinition("");
  };

  // read from firebase realtime database
  useEffect(() => {
    const dbRef = ref(db, "nature/fruits");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fruitsArray = Object.entries(data).map(([id, fruit]) => ({
          id,
          ...fruit,
        }));
        setFruits(fruitsArray);
      } else {
        setFruits([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col max-w-[500px] gap-6 p-4">
      <div className="border-2 flex flex-col p-4 gap-4 border-slate-700 rounded-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 p-2 rounded-md border-slate-900 text-black"
          placeholder="Enter fruits name"
          type="text"
        />
        <input
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          required={true}
          placeholder="Enter fruits definition"
          className="border-2 p-2 rounded-md border-slate-900 text-black"
          type="text"
        />
        <button
          onClick={handleSubmitData}
          className="border-slate-800 rounded-md px-5 border-4 cursor-pointer py-2 text-black font-bold hover:bg-gray-100"
        >
          Save Data
        </button>
      </div>

      {/* display data */}
      <div className="mt-20 flex flex-wrap justify-center items-center gap-4">
        {
            fruits.map((fruit) => <div key={fruit?.id} className="border-2 p-4 rounded-md border-green-600 flex flex-col gap-4">
                <p>{fruit?.fruitsName}</p>
                <p>{fruit?.fruitsDefinition}</p>
            </div>)
        }
      </div>
    </div>
  );
};

export default Write;
