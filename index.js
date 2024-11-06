const express = require("express")
const app = express()
const { initializeDatabase } = require("./db/db.connect")
initializeDatabase()

const Hotel = require("./models/hotel.models")

app.use(express.json())

const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// const newHotel = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: [
//     "Room Service",
//     "Horse riding",
//     "Boating",
//     "Kids Play Area",
//     "Bar",
//   ],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: [
//     "https://example.com/hotel2-photo1.jpg",
//     "https://example.com/hotel2-photo2.jpg",
//   ],
// }

const createHotel = async (newHotel) => {
  try {
    const hotel = new Hotel(newHotel)
    const hotelSave = await hotel.save()
    // console.log("Hotel data added succesfully", hotelSave)
    return hotelSave
  } catch (error) {
    console.log(error)
  }
}

// createHotel(newHotel)
//creating an API post
app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body)
    res.status(201).json({
      message: "Hotel added successfully.",
      hotel: savedHotel,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotel" })
  }
})

//3 writing a function to read all hotels from database
async function readAllHotels() {
  try {
    const hotels = await Hotel.find()
    // console.log(hotels)
    return hotels
  } catch (error) {
    console.log(error)
  }
}
// readAllHotels()

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels()

    if (hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "Hotels not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

//4 writing a function to read hotel details by its name(Lake View)
async function readHotelByName(name) {
  try {
    const hotel = await Hotel.findOne({ name: name })
    //  console.log(hotel)
    return hotel
  } catch (error) {
    console.log(error)
  }
}
// readHotelByName("Lake View")

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName)

    if (hotel) {
      res.json(hotel)
    } else {
      res.status(404).json({ error: "Hotels not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

//7 writing a function to read hotels details by mid-range category
async function readHotelByCategory(category) {
  try {
    const hotels = await Hotel.find({
      category: category,
    })
    // console.log(hotels)
    return hotels
  } catch (error) {
    console.log(error)
  }
}

// readHotelByCategory("Mid-Range")
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readHotelByCategory(req.params.hotelCategory)

    if (hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "Hotels not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

//9 writing a function to read hotels details of rating 4
async function readHotelByRating(rating) {
  try {
    const hotels = await Hotel.find({
      rating: rating,
    })
    // console.log(hotels)
    return hotels
  } catch (error) {
    console.log(error)
  }
}

// readHotelByRating(4)
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readHotelByRating(req.params.hotelRating)

    if (hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "Hotels not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

//10 writing a function to read hotels details by phone Number
async function readHotelByPhoneNumber(number) {
  try {
    const hotels = await Hotel.find({
      phoneNumber: number,
    })
    // console.log(hotels)
    return hotels
  } catch (error) {
    console.log(error)
  }
}
// readHotelByPhoneNumber("+1299655890")
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotels = await readHotelByPhoneNumber(req.params.phoneNumber)

    if (hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "Hotels not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" })
  }
})

//writing a function to delete a hotel from mongoose database
async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  } catch (error) {
    console.log(error)
  }
}

//writing an api to delete a hotel from mongoose DB
app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId)
    if (deletedHotel) {
      res.status(200).json({
        message: "Hotel deleted successfully.",
        deletedHotel: deletedHotel,
      })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel" })
  }
})

//1 writing a function that takes hotel id and accepts data to be updated and updates the DB data
const updateHotel = async (hotelId, dataToUpdate) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    })
    // console.log(updatedHotel)
    return updatedHotel
  } catch (error) {
    console.log("Error in updating data", error)
  }
}
//  updateHotelCheckOutTime("670e5fb3f2b85f6b698e3a28",{isSpaAvailable
// false})

//writing an api to update the data in mongoose database
app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body)
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully",
        hotel: updatedHotel,
      })
    } else {
      res.status(404).json({ error: "Hotel not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel" })
  }
})

app.get("/", (req, res) => {
  res.send("Hello, Express server.")
})

const PORT = 3000
app.listen(PORT, () => {
  console.log("Server running on port ", PORT)
})
