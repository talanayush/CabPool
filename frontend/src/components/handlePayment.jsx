const handlePayment = async (userID, amount, setUpiLink, setShowUPIModal) => {
    try {
      // Fetch UPI ID from backend
      const response = await fetch(`http://localhost:5000/api/get-upi/${userID}`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch UPI ID");
      }
  
      const upiId = data.upiId; // Extract UPI ID
  
      // Generate UPI payment link
      const link = `upi://pay?pa=${upiId}&pn=CabSharing&am=${amount}&cu=INR`;
      setUpiLink(link);
  
      // Detect mobile devices
      const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = link; // Redirect to UPI app
      } else {
        setShowUPIModal(true); // Show modal on desktop
      }
    } catch (error) {
      console.error("Error fetching UPI ID:", error);
      alert("Failed to fetch UPI ID. Please try again.");
    }
  };
  
  export default handlePayment;
  