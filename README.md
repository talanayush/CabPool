
# 🚖 Cab Pool  https://cab-pool1-frontend.vercel.app/

A seamless **cab pooling** web application designed for college students to efficiently share rides between **Sector 62 and Sector 128 campuses**. The platform replaces the existing WhatsApp-based system, allowing users to **create, join, and manage ride tickets** while integrating a **UPI-based payment system** for cost-sharing.

---

## 🚀 Features

- **Ride Ticket System**: Users can create and join cab ride tickets based on availability.  
- **Real-Time Sorting**: Tickets are sorted by time, ensuring the **earliest rides appear first**.  
- **Automated Ticket Management**:  
  - Tickets are **hidden** once their time has passed.  
  - Expired tickets are **permanently deleted** from the system.  
- **Secure Authentication**: Implemented using **JWT (JSON Web Token)**.  
- **Seamless Payments**: Integrated **UPI-based payment** where the ticket creator enters the fare, and other riders can pay their share.  
- **Progressive Web App (PWA)**: Ensures fast and reliable performance on mobile devices.  

---

## 🛠 Tech Stack

### **Frontend**  
- **ReactJS** – Component-based UI  
- **Tailwind CSS** – Responsive styling  

### **Backend**  
- **Node.js & Express.js** – REST API development  
- **MongoDB Atlas** – Cloud database for storing ride tickets and user data  
- **JWT Authentication** – Secure login system  

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/talanayush/CabPool.git
cd Cab-Pool
```

### **2️⃣ Install Dependencies**
#### Backend:
```bash
cd backend
npm install
```
#### Frontend:
```bash
cd frontend
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the **backend** folder and add:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### **4️⃣ Run the Application**
#### Start Backend:
```bash
cd backend
npm run dev
```
#### Start Frontend:
```bash
cd frontend
npm start
```

---

## 📌 Usage

1. **Sign up / Log in** to the platform.  
2. **Create a new ride ticket** or **join an existing one**.  
3. **Confirm the ride details** and make payments via **UPI**.  
4. **Tickets automatically expire** once the ride time has passed.  

---

## 🎯 Future Enhancements

- **Live Tracking**: Real-time location updates of the cab.  
- **User Ratings & Reviews**: Rate co-passengers for safety and reliability.  
- **Ride History**: View past rides and payment details.  

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repository  
2. Create a new branch (`feature-branch`)  
3. Commit your changes  
4. Open a **Pull Request**  

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

For any queries or contributions, feel free to reach out!  

👤 **Ayush Talan**  
📧 Email: [your-email@example.com](mailto:your-email@example.com)  
🔗 GitHub: [talanayush](https://github.com/talanayush)  
