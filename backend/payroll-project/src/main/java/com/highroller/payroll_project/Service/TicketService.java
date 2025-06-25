package com.highroller.payroll_project.Service;

import com.highroller.payroll_project.Entity.TicketEntity;
import com.highroller.payroll_project.Repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    public List<TicketEntity> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<TicketEntity> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public TicketEntity createTicket(TicketEntity ticket) {
        return ticketRepository.save(ticket);
    }

    public boolean deleteTicket(Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
