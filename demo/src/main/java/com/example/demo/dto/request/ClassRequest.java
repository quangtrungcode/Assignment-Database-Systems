package com.example.demo.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassRequest {
     Integer classCapacity;
     String semester;
     String day;
     String room;
}
