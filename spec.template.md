# Spec

## 1. Background

### Problem Statement: ⟦What hurts today?⟧

### Context / History: ⟦Relevant prior work, links, tickets⟧

### Stakeholders: ⟦Teams, users, external systems⟧

---

## 2. Motivation

### Goals & Success Metrics

⟦e.g. reduce P99 latency by 30 %⟧

### Non-Goals

⟦Explicitly out of scope⟧

### Value Proposition

⟦How does this solve the problem?⟧

---

## 3. Approaches & Trade-offs

| Approach       | Decision | Rationale                           | Impact                |
| -------------- | -------- | ----------------------------------- | --------------------- |
| ⟦e.g. Storage⟧ | ⟦Use S3⟧ | ⟦Cheaper, but eventual consistency⟧ | ⟦Risk of stale reads⟧ |

Add rows as needed. Capture limitations, risks, deferred work, and accepted debts.

---

## 4. Step-by-Step Flow

### 4.1 Main (“Happy”) Path

1.⁠ ⁠*Pre-condition:* ⟦state before action⟧

2.⁠ ⁠*Actor* ⟦User / Service⟧ _triggers_ ⟦API call / UI action⟧

3.⁠ ⁠System _validates_ ⟦rules⟧

4.⁠ ⁠System _persists / computes / emits_ ⟦results⟧

5.⁠ ⁠*Post-condition:* ⟦state after action⟧

### 4.2 Alternate / Error Paths

| #   | Condition       | System Action | User Feedback  |
| --- | --------------- | ------------- | -------------- |
| A1  | ⟦Token expired⟧ | ⟦401 + log⟧   | ⟦Prompt login⟧ |

---

## 5. UML Diagrams

Embed Mermaid (or exported PNG/SVG) for each relevant view.

⁠ mermaid
classDiagram  
class ClassA { +id : UUID +doThing() }  
ClassB: derp
ClassA --> ClassB : uses
 ⁠

⁠ mermaid
sequenceDiagram
participant User
participant API
participant DB
User->>API: ⟦POST /do⟧
API->>DB: write()
DB-->>API: OK
API-->>User: 200 OK
 ⁠

⁠ mermaid
stateDiagram
[*] --> Idle
Idle --> Active : start()
Active --> Idle : stop()
Active --> Error : fail()

⁠

---

## 5. Edge cases and concessions

•⁠ ⁠Any edge cases not accounted for , design decisions that compromise full expected behavior , things that are off scope for any reason

## 6. Open Questions

•⁠ ⁠⟦Any unknowns, blockers, external approvals needed⟧

## 7. Glossary / References

•⁠ ⁠*⟦Term⟧* — ⟦Definition⟧

•⁠ ⁠Links: ⟦RFCs, PRDs, tickets⟧

Spec template
