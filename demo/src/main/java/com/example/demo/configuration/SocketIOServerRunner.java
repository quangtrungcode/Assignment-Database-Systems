package com.example.demo.configuration;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

@Component
public class SocketIOServerRunner implements CommandLineRunner {

    private final SocketIOServer server;

    @Autowired
    public SocketIOServerRunner(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        // 👇 Dòng này cực quan trọng: Khởi động Socket Server
        server.start();
        System.out.println("✅ SOCKET.IO SERVER STARTED ON PORT 8085");
    }

    @PreDestroy
    public void stopSocketIOServer() {
        // Tắt server khi ứng dụng dừng để giải phóng port
        server.stop();
        System.out.println("🛑 SOCKET.IO SERVER STOPPED");
    }
}