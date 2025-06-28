package com.highroller.payroll_project.Controller;

import com.highroller.payroll_project.Entity.TicketEntity;
import com.highroller.payroll_project.Repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = { "http://localhost:5173",
        "http://localhost:5174" }, allowCredentials = "true", allowedHeaders = "*", methods = {
                RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
        })
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
    public ResponseEntity<TicketEntity> createTicket(@RequestBody TicketEntity ticket) {
        try {
            TicketEntity savedTicket = ticketRepository.save(ticket);
            return ResponseEntity.ok(savedTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
    public ResponseEntity<TicketEntity> updateTicketStatus(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Optional<TicketEntity> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            TicketEntity ticket = ticketOpt.get();
            String newStatus = request.get("status");
            if (newStatus != null) {
                ticket.setStatus(newStatus);
                return ResponseEntity.ok(ticketRepository.save(ticket));
            }
        }
        return ResponseEntity.notFound().build();
    }
}
