package com.julietasalvado.roadmapprogress.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.util.Arrays;

@Validated
@NoArgsConstructor
@AllArgsConstructor
public enum NodeTypeEnum {
  START("START"), MAIN_TOPIC("MAIN_TOPIC"), UNKNOWN("UNKNOWN");

  private String value;

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static NodeTypeEnum getByValue(String text) {
    return Arrays.stream(NodeTypeEnum.values())
            .filter(a -> a.value.equals(text))
            .findFirst()
            .orElse(NodeTypeEnum.UNKNOWN);
  }
}
