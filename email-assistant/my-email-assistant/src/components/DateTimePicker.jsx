import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, useColorModeValue } from "@chakra-ui/react";

const DateTimePicker = ({ selectedDate, onChange }) => {
  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputBorderColor = useColorModeValue("gray.200", "gray.600");
  const inputTextColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        showTimeSelect
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        placeholderText="Select Date and Time"
        className="form-control"
        inline
        style={{
          width: "100%",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "0.375rem",
          borderWidth: "1px",
          borderColor: inputBorderColor,
          color: inputTextColor,
          backgroundColor: inputBgColor,
          boxShadow: "none",
        }}
        // alignSelf="center"
        // justifySelf="center"
        // mt={14}
      />
    </Box>
  );
};

export default DateTimePicker;
