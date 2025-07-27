export const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "gray";
      case "processing":
      case "assigned":
        return "blue";
      case "out_for_delivery":
        return "orange";
      case "delivered":
        return "green";
      case "cancelled":
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };