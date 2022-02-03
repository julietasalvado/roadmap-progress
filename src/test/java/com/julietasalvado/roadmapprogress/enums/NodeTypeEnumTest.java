package com.julietasalvado.roadmapprogress.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NodeTypeEnumTest {

  @Test
  void givenInvalidValueWhenGettingByValueThenReturnUnknown() {
    NodeTypeEnum invalid = NodeTypeEnum.getByValue("INVALID");

    // then
    assertEquals(NodeTypeEnum.UNKNOWN, invalid);
  }

  @Test
  void givenUnknownWhenGettingByValueThenReturnUnknown() {
    NodeTypeEnum invalid = NodeTypeEnum.getByValue("UNKNOWN");

    // then
    assertEquals(NodeTypeEnum.UNKNOWN, invalid);
  }

  @Test
  void givenStartWhenGettingByValueThenReturnStart() {
    NodeTypeEnum invalid = NodeTypeEnum.getByValue("START");

    // then
    assertEquals(NodeTypeEnum.START, invalid);
  }

  @Test
  void givenMainTopicWhenGettingByValueThenReturnMainTopic() {
    NodeTypeEnum invalid = NodeTypeEnum.getByValue("MAIN_TOPIC");

    // then
    assertEquals(NodeTypeEnum.MAIN_TOPIC, invalid);
  }
}