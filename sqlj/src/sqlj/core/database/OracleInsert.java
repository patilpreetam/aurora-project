package sqlj.core.database;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Map;

import sqlj.core.IContext;

/**
 * primary key generated by sequence
 * 
 * @author jessen
 * 
 */
public class OracleInsert extends AbstractInsert {
	private int pkIndex;



	public OracleInsert(IContext context, Map map, String tableName,
			String pkName) {
		super(context, map, tableName, pkName);
		// TODO Auto-generated constructor stub
	}

	public OracleInsert(IContext context, Object bean) {
		super(context, bean);
	}

	@Override
	protected Object execute(PreparedStatement ps) throws SQLException {
		CallableStatement cs = (CallableStatement) ps;
		cs.execute();
		long pk = cs.getLong(pkIndex);
		return pk;
	}

	@Override
	protected int performParameterBinding(PreparedStatement ps)
			throws SQLException {
		pkIndex = super.performParameterBinding(ps);
		CallableStatement cs = (CallableStatement) ps;
		cs.registerOutParameter(pkIndex, Types.NUMERIC);
		return pkIndex + 1;
	}

	@Override
	protected String getPrefix() {
		return "begin ";
	}

	@Override
	protected String getSuffix() {
		return " returning " + getPkField() + " into ?; end;";
	}

	@Override
	protected String getDateExpression() {
		return "trunc(sysdate)";
	}

	@Override
	protected String getTimeExpression() {
		return "sysdate";
	}

	@Override
	protected String getInsertExpressionForPk() {
		return getTableName() + "_s.nextval";
	}

	@Override
	protected PreparedStatement createStatemtent(Connection conn, String sql)
			throws SQLException {
		return conn.prepareCall(sql);
	}

}
