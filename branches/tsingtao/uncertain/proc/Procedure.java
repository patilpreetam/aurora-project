/*
 * Created on 2005-3-23
 *
 */
package uncertain.proc;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import uncertain.composite.CompositeMap;
import uncertain.ocm.OCManager;

/**
 * Implements <code><procedure></code> tag
 * @author Zhou Fan
 */

public class Procedure extends EntryList {
    
    OCManager           oc_manager;
    // name -> field
    HashMap             field_map;
    //List<Field> to hold all fields
    LinkedList          field_list;
    Field               return_field;
    //List<Field> to hold all input fields;
    LinkedList          input_fields;
    //Handles
    Collection          exception_handles;
    //Default participants 
    String              participants;
    LinkedList          participant_class_list;
    
    boolean             Debug = false;

    
    public Procedure(){
        
    }
    
    public Procedure(OCManager om){
        this.oc_manager = om;
    }
    
    /**
     * Before running procedure, push all context fields defined in context to participants
     * @param runner
     */
    void populateContextFields(ProcedureRunner runner) throws Exception { 
        List inputs = getInputFieldList();
        if(inputs==null) return;
        runner.transferContextFields(inputs, true);
    }
    
    void addDefaultParticipants(ProcedureRunner runner) throws Exception {
        Iterator it = participant_class_list.iterator();
        while(it.hasNext()){
            Class cls = (Class)it.next();
            Object p = null;
            if(oc_manager!=null)
                p = oc_manager.getObjectCreator().createInstance(cls);
            else
                p = cls.newInstance();
            runner.getConfiguration().addParticipant(p);
        }        
    }
    
    void clearFields( CompositeMap map ){
        if(field_list==null)
            return;
        Iterator it = field_list.iterator();
        while(it.hasNext()){
            Field f = (Field)it.next();
            if(!f.isInputField())
                map.putObject(f.getPath(),null);
        }
    }
    
    public void run(ProcedureRunner runner) throws Exception {
         //ILogger logger = runner.getLogger();
         //logger.log(Level.CONFIG, "Enter procedure " + getName());
         populateContextFields(runner);
         if(exception_handles!=null) 
             runner.addExceptionHandles(exception_handles);
         // Add default participants
         if(participant_class_list!=null){
             addDefaultParticipants(runner);
         }
         runner.run(this);
    }

    /**For any child elements defined in procedure config that is not a built-in element,
     * and can be parsed into a IEntry instance, add parsed instance to entry list
     * @see uncertain.proc.EntryList#addChild(uncertain.composite.CompositeMap)
     */
    public void addChild(CompositeMap child) {
        if(oc_manager==null){            
            return;
        }
        if(!oc_manager.canCreateInstance(child)) {
            return;
        }        
        Object o = oc_manager.createObject(child);
        if(o != null)
            if(o instanceof IEntry){
                addEntry((IEntry)o);
            }
    }    
    /**
     * Add a context field definition, can be invoked when populating from CompositeMap
     * @param f context field to add
     */
    public void addField(Field f){
        if(field_map==null){ 
            field_map = new HashMap();
            field_list = new LinkedList();
            input_fields = new LinkedList();
        }
        field_map.put(f.getName(),f);
        field_list.add(f);
        if(f.isReturnField()) return_field = f;
        else if(f.isInputField()) input_fields.add(f);
    }
    
    /**
     * Get a context field definition by name
     * @param name name of context field
     * @return a Field instance, or null if doesn't contain named field
     */
    public Field getField(String name){
        if(field_map==null) return null;
        return (Field)field_map.get(name);
    }
    
    public Field getReturnField(){
        return return_field;
    }
    
    /**Set array of context field
     * @ioc
     * @param fields
     */
    public void setFields(Field[] fields){
        for(int i=0; i<fields.length; i++) addField(fields[i]);
    }
    
    public Field[] getFields(){
        if(field_map == null) return null;
        Object[] o = field_list.toArray();
        Field[] f = new Field[o.length];
        System.arraycopy(o, 0, f,0, o.length);
        return f;
    }

    public Map getContextFieldMap(){
        return field_map;
    }
    
    /** retrieve all input fields defined
     *  @return a list of all <code>Field</code> instances that is input field.
     *  If procedure has no input field, the return list is of size 0.      
     */
    public List getInputFieldList(){
        return input_fields;
    }
    
    /**
     * Set a list of exception handles
     * @param handles
     */
    
    public void setExceptionHandles(Collection handles){
        if(exception_handles==null) 
            exception_handles = handles;
        else
            exception_handles.addAll(handles);
    }
    
    public Collection getExceptionHandles(){
        return exception_handles;
    }
    
    /*
    public void addParticipants(){
        
    }
    */

    /**
     * @return the participants
     */
    public String getParticipants() {
        return participants;
    }

    /**
     * @param participants the participants to set
     */
    public void setParticipants(String participants) 
        throws ClassNotFoundException
    {
        this.participants = participants;
        if(participant_class_list!=null) participant_class_list.clear();
        else participant_class_list = new LinkedList();
        
        String[] classes = participants.split(",");
        for(int i=0; i<classes.length; i++){
            String cls = classes[i].trim();
            participant_class_list.add(Class.forName(cls));
        }        
    }
    
    public void clear(){
        super.clear();
        if(field_map!=null)
            field_map.clear();
        if(field_list!=null)
            field_list.clear();
        if(input_fields!=null)
            input_fields.clear();
        if(exception_handles!=null)
            exception_handles.clear();
        if(participant_class_list!=null)
            participant_class_list.clear();
    }

}