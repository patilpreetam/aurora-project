/* -*- Mode: java; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package aurora.javascript;

/**
 * Exception thrown by
 * {@link aurora.javascript.Context#executeScriptWithContinuations(Script, Scriptable)}
 * and {@link aurora.javascript.Context#callFunctionWithContinuations(Callable, Scriptable, Object[])}
 * when execution encounters a continuation captured by
 * {@link aurora.javascript.Context#captureContinuation()}.
 * Exception will contain the captured state needed to restart the continuation
 * with {@link aurora.javascript.Context#resumeContinuation(Object, Scriptable, Object)}.
 * @author Norris Boyd
 */
public class ContinuationPending extends RuntimeException {
    private static final long serialVersionUID = 4956008116771118856L;
    private NativeContinuation continuationState;
    private Object applicationState;

    /**
     * Construct a ContinuationPending exception. Internal call only;
     * users of the API should get continuations created on their behalf by
     * calling {@link aurora.javascript.Context#executeScriptWithContinuations(Script, Scriptable)}
     * and {@link aurora.javascript.Context#callFunctionWithContinuations(Callable, Scriptable, Object[])}
     * @param continuationState Internal Continuation object
     */
    ContinuationPending(NativeContinuation continuationState) {
        this.continuationState = continuationState;
    }

    /**
     * Get continuation object. The only
     * use for this object is to be passed to
     * {@link aurora.javascript.Context#resumeContinuation(Object, Scriptable, Object)}.
     * @return continuation object
     */
    public Object getContinuation() {
        return continuationState;
    }

    /**
     * @return internal continuation state
     */
    NativeContinuation getContinuationState() {
        return continuationState;
    }

    /**
     * Store an arbitrary object that applications can use to associate
     * their state with the continuation.
     * @param applicationState arbitrary application state
     */
    public void setApplicationState(Object applicationState) {
        this.applicationState = applicationState;
    }

    /**
     * @return arbitrary application state
     */
    public Object getApplicationState() {
        return applicationState;
    }
}
