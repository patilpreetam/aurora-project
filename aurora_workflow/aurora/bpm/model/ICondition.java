/*
 * Created on 2014-8-31 下午7:20:12
 * $Id$
 */
package aurora.bpm.model;

public interface ICondition {
    
    public boolean isMeet( IProcessInstancePath path );

}
