package com.maja.multiplex.Controller;

import com.maja.multiplex.Model.*;
import com.maja.multiplex.Repository.ReservationRepository;
import com.maja.multiplex.Repository.SeatRepository;
import com.maja.multiplex.Repository.SeatScreeningReservationRepository;
import com.maja.multiplex.Repository.TicketTypeRepository;
import com.maja.multiplex.Service.ScreeningService;
import com.maja.multiplex.View.ReservationView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/screenings")
public class ScreeningController {

    @Autowired
    private ScreeningService screeningService;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SeatScreeningReservationRepository seatScreeningReservationRepository;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public String getScreeningsForDateAndTime(@RequestParam("day") @DateTimeFormat(pattern = "ddMMyyyy") Date date,
                                       @RequestParam(value = "from", required = false) @DateTimeFormat(pattern = "HHmm") Date fromTime,
                                       @RequestParam(value = "to", required = false) @DateTimeFormat(pattern = "HHmm") Date toTime) {
        java.sql.Date paramDate = new java.sql.Date(date.getTime());

        List<Screening> screenings = new ArrayList<>();

        if (fromTime != null && toTime != null) {
            java.sql.Time paramFromTime = new java.sql.Time(fromTime.getTime());
            java.sql.Time paramToTime = new java.sql.Time(toTime.getTime());
            screenings = screeningService.getAllForDateAndTime(paramDate, paramFromTime, paramToTime);

        } else {
            screenings = screeningService.getAllForDateAndTime(paramDate);
        }

        if (screenings.isEmpty()) {
            return "No screenings for date " + paramDate;
        }

        return screenings.stream().map(s -> {
                return s.getScreeningID().toString() + " " + s.getMovie().getMovieTitle() + " " + s.getHall().getHallName() + "\n";
        }).collect(Collectors.joining());
    }

    @RequestMapping(value = "/{screening_id}", method = RequestMethod.GET)
    @ResponseBody
    public String getScreening(@PathVariable("screening_id") long id) {
        return screeningService.getAllSeatsForScreeningWithID(id).stream().map(
                seat -> {return seat.getSeatID() + " " + seat.getSeatRow() + seat.getSeatID() + "\n";}
        ).collect(Collectors.joining());
    }

    @RequestMapping(value = "/{screening_id}", method = RequestMethod.POST)
    @ResponseBody
    public String makeReservation(@RequestBody ReservationView reservation, @PathVariable("screening_id") long id) {
        try {
            if (reservation.isValid()) {

                // TODO: error handling

                Reservation newReservation = new Reservation();

                newReservation.setType(ticketTypeRepository.findByTicketTypeName(reservation.getTicketType()).get());
                newReservation.setPersonName(reservation.getPersonName());
                newReservation.setPersonSurname(reservation.getPersonSurname());

                Seat seat = seatRepository.findById(reservation.getSeatID()).get();
                Screening screening = screeningService.getScreeningWithID(id);

                newReservation.setSeat(seat);
                newReservation.setScreening(screening);

                seatScreeningReservationRepository.findBySeatAndScreening(seat, screening).get()
                        .setSeatScreeningReservationStatus(SeatStatus.RESERVED);

                reservationRepository.save(newReservation);

                return "Done";
            } else {
                return "Error";
            }
        } catch (IllegalAccessException e) {
            return "Illegal Access Exception";
        }
    }

}
