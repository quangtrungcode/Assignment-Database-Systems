package com.example.demo.configuration;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        // Chạy trên localhost
        config.setHostname("localhost");
        // ⚠️ QUAN TRỌNG: Chạy port khác với server chính (8080) để tránh lỗi
        config.setPort(8085);

        // Fix lỗi CORS cho Socket server riêng
        config.setOrigin("*");

        return new SocketIOServer(config);
    }
}