  export const formatAddress = (address) => {
    if (!address) return "";

    const parts = [
      address.line1,
      address.line2,
      ...(address.extras || []),
      address.town,
      address.postcode
    ].filter(Boolean);

    return parts.join(", ");
  };