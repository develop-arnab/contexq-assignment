import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  const DB_URL =
    "mongodb+srv://create:3.14ToInfinity@createapp.fhl1vbl.mongodb.net/contexQ";

  try {
    await mongoose.connect(DB_URL);
  } catch (err) {
    console.log(err);
  }
};

export { ConnectDB };
