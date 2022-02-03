package com.julietasalvado.roadmapprogress.model;

import com.julietasalvado.roadmapprogress.enums.NodeTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "roadmap_nodes")
public class Node {

  @Id
  private String nodeId;

  private String title;
  private int height;
  private int width;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "roadmap_id", nullable = false)
  private Roadmap roadmap;

  @Enumerated(EnumType.STRING)
  private NodeTypeEnum type;

  public String getId() {
    return this.nodeId;
  }
}
