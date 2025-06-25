package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.TicketEntity;
import com.highroller.payroll_project.Repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping
    public List<TicketEntity> getAllTickets() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketEntity> getTicketById(@PathVariable Long id) {
        Optional<TicketEntity> ticket = ticketRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TicketEntity createTicket(@RequestBody TicketEntity ticket) {
        return ticketRepository.save(ticket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketEntity> updateTicketStatus(@PathVariable Long id, @RequestBody String status) {
        Optional<TicketEntity> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            TicketEntity ticket = ticketOpt.get();
            ticket.setStatus(status.replaceAll("\"", "")); // Remove quotes if sent as JSON string
            ticketRepository.save(ticket);
            return ResponseEntity.ok(ticket);
        }
        return ResponseEntity.notFound().build();
    }
}
