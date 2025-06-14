# 3-Point Protocol v2.0: Agent-Optimized Debugging

## Core Philosophy
**CONCISE → ACTIONABLE → TRANSFERABLE**
- Minimal tokens, maximum insight
- No execution without explicit .E command
- Agent-to-agent handoff ready

## Command Structure
```
!3.2      = Investigation + Verification (NO EXECUTION)
!3.2.E    = Investigation + Verification + Execute
!3.I.2    = Investigation + Innovation + Verification (NO EXECUTION)  
!3.I.2.E  = Full process + Execute
!R        = Standalone Detailed Report

MODIFIER: .R can be appended to any command for detailed reporting:
!3.2.R    = Investigation + Verification + Report (NO EXECUTION)
!3.2.E.R  = Investigation + Verification + Execute + Report  
!3.I.2.R  = Investigation + Innovation + Verification + Report (NO EXECUTION)
!3.I.2.E.R = Full process + Execute + Report
```

## Phase 1: Matrix Investigation (3)
**Single unified analysis - no sequential points**

### Investigation Matrix
```
ISSUE: [exact problem in <20 words]
SCOPE: [affected files/components]
ROOT: [fundamental cause]
FLOW: [data/control path impact]  
DEPS: [critical dependencies]
```

### Tool Strategy
- Pre-plan all searches → Execute in parallel
- Target: codebase_search + grep_search + read_file simultaneously
- Gather complete context in one tool burst

## Phase 2: Risk-Tiered Verification (2)

### Auto-Risk Assessment
```
LOW: Single file, <50 lines, no dependencies → Skip verification
MED: Multiple files OR >50 lines → Single verification point
HIGH: Core systems OR >200 lines → Full verification
```

### Verification Output
```
SOLUTION: [approach in <30 words]
RISK: [L/M/H + reason]
BACKUP: [rollback strategy if HIGH risk]
SUCCESS: [how to verify it worked]
```

## Phase 3: Innovation (I) - Optional
**Only when explicitly requested**

### Innovation Matrix
```
OPTIMIZE: [performance gains available]
PREVENT: [future-proofing measures]  
PATTERN: [reusable solution elements]
```

## Phase 4: Execution (E) - Explicit Only
**CRITICAL: Only executes when .E specified**

### Execution Gates
- ❌ NO .E = Investigation/Verification ONLY
- ✅ .E present = Proceed with implementation
- Always confirm execution intent before proceeding

## Phase R: Detailed Report Function
**Comprehensive problem analysis - Can be standalone (!R) or appended to any command (.R)**

### Report Structure
```
ISSUE: [detailed problem description]
IMPACT: [user/system impact analysis]
ROOT_CAUSES: [fundamental causes with evidence]
AFFECTED_SYSTEMS: [all impacted components]
DEPENDENCIES: [critical relationships]
TECHNICAL_DEBT: [accumulated issues contributing to problem]
RECOMMENDATIONS: [prioritized fix strategies]
WORKAROUNDS: [temporary solutions if needed]
```

### When to Use .R Modifier:
- Complex multi-system issues requiring detailed documentation
- Performance problems needing comprehensive analysis  
- Architecture decisions requiring full context
- Before major refactoring with impact assessment
- Agent handoff requiring complete problem breakdown
- Post-execution analysis for learning/documentation

### .R Modifier Behavior:
- **With Investigation (!3.2.R)**: Detailed analysis + comprehensive verification report
- **With Execution (!3.2.E.R)**: Implementation + detailed post-execution report  
- **With Innovation (!3.I.2.R)**: Full innovation analysis + detailed recommendations
- **Standalone (!R)**: Pure analytical report without other phases

### Report Output Template
```
=== DETAILED ANALYSIS REPORT ===
ISSUE: [comprehensive problem statement]
SEVERITY: [LOW/MED/HIGH/CRITICAL + business impact]
SCOPE: [affected files, systems, user flows]

ROOT ANALYSIS:
- Primary: [main cause with evidence]
- Secondary: [contributing factors]
- Systemic: [architectural issues]

IMPACT ASSESSMENT:
- User Experience: [specific UX issues]
- Performance: [measurable degradation]
- Maintainability: [development friction]
- Security: [potential vulnerabilities]

SOLUTION PATHWAYS:
1. QUICK FIX: [immediate mitigation - hours]
2. PROPER FIX: [comprehensive solution - days]
3. STRATEGIC FIX: [long-term architectural - weeks]

DEPENDENCIES & RISKS:
- Blockers: [what prevents fixes]
- Side Effects: [potential breaking changes]
- Testing Requirements: [verification strategy]

NEXT ACTIONS:
[ ] Immediate steps
[ ] Follow-up investigations needed
[ ] Stakeholder approvals required
===========================
```

## Agent Transfer Format
**Optimized for agent handoffs**

```
PROTOCOL: 3.2[.I][.E]
STATUS: [INVESTIGATING|VERIFIED|EXECUTED]
ISSUE: [problem summary]
FILES: [affected files list]
SOLUTION: [implementation approach]
NEXT: [what agent should do next]
```

## Token Efficiency Rules

### Response Compression
- Max 200 tokens per investigation phase
- Use structured formats over prose
- Reference specific lines: `12:15:file.ts`
- Eliminate redundant explanations

### Investigation Shortcuts
```
QUICK: Simple issues → Direct to solution
DEEP: Complex issues → Full matrix analysis
AUTO: Risk assessment determines depth
```

### Output Templates

#### Standard Investigation (!3.2)
```
ISSUE: [problem]
ROOT: [cause] 
FILES: [affected]
SOLUTION: [approach]
RISK: [L/M/H]
AWAITING: User approval for execution
```

#### With Innovation (!3.I.2)
```
ISSUE: [problem]
ROOT: [cause]
SOLUTION: [fix]
OPTIMIZE: [improvements]
RISK: [L/M/H]
AWAITING: User approval for execution
```

#### Execution Ready (!3.2.E)
```
ISSUE: [problem]
SOLUTION: [approach]
EXECUTING: [implementation steps]
VERIFY: [success check]
```

## Quality Gates
- Every response ≤ 300 tokens unless complex issue requires more
- No execution without explicit .E command
- Agent handoff packet included in every response
- All findings backed by specific file/line references

## Integration Notes
- Respects all user rules (no deletion, 500-line limits, PowerShell syntax)
- Uses parallel tool execution by default
- Maintains /logs/ documentation requirements
- Creates backups before any changes (when .E specified)

---
**Remember: Investigation ≠ Implementation**  
**Only .E commands result in code changes** 
