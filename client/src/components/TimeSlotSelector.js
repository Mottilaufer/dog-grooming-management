import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailableslots } from "../redux/actions/appointmentActions";
import "./TimeSlotSelector.scss";

const TimeSlotSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const { availableSlots } = useSelector((state) => state.appointments);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        dispatch(fetchAvailableslots(token))
      } catch (error) {
        console.error("Unexpected error fetching available slots", error);
      }
    };
    fetchAvailableSlots();
  }, [dispatch, token]);

  useEffect(() => {
    if (availableSlots) {
      setAvailableDays(availableSlots);
    }
  }, [availableSlots]);

  const handleSlotClick = (day, time, isBooked) => {
    if (isBooked) return;
    const slot = { day, time }; 
    setSelectedSlot(slot);
    onSelect(slot);
  };

  const handleNextDay = () => {
    if (currentDayIndex < availableDays.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  return (
    <div className="time-slot-selector">
      {availableDays.length > 0 && (
        <>
          <h3>{availableDays[currentDayIndex].date}</h3>
          <div className="navigation-buttons">
            <button onClick={handlePrevDay} disabled={currentDayIndex === 0}>
              Previous
            </button>
            <button
              onClick={handleNextDay}
              disabled={currentDayIndex === availableDays.length - 1}
            >
              Next
            </button>
          </div>
          <div className="time-slots">
            {availableDays[currentDayIndex].slots.map((slot) => (
              <button
                key={slot.time}
                className={`time-slot ${slot.isBooked ? "disabled" : ""} ${
                  selectedSlot && selectedSlot.time === slot.time && selectedSlot.day === availableDays[currentDayIndex].date ? "selected" : ""
                }`}
                disabled={slot.isBooked}
                onClick={() =>
                  handleSlotClick(
                    availableDays[currentDayIndex].date,
                    slot.time,
                    slot.isBooked
                  )
                }
              >
                {slot.time}
              </button>
            ))}
          </div>

       
        </>
      )}
    </div>
  );
};

export default TimeSlotSelector;
