package com.maja.multiplex.Controller;

import com.maja.multiplex.Repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @RequestMapping(value = "/{reservation_id}", method = RequestMethod.GET)
    @ResponseBody
    public String getReservation(@PathVariable("reservation_id") long id) {
        return "Reservation with ID " + id;
    }

}
