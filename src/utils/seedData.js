const Department = require('../models/Department');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Student = require('../models/Student');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Check if data already exists
    const departmentCount = await Department.countDocuments();
    if (departmentCount > 0) {
      console.log('📊 Database already has data. Skipping seed.');
      return;
    }

    // Create Departments
    const departments = await Department.insertMany([
      {
        name: 'Computer Science and Engineering',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        established: new Date('2010-01-01')
      },
      {
        name: 'Electrical and Electronics Engineering',
        code: 'EEE',
        description: 'Department of Electrical and Electronics Engineering',
        established: new Date('2008-01-01')
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        description: 'Department of Mechanical Engineering',
        established: new Date('2005-01-01')
      },
      {
        name: 'Civil Engineering',
        code: 'CE',
        description: 'Department of Civil Engineering',
        established: new Date('2003-01-01')
      }
    ]);

    console.log(`✅ Created ${departments.length} departments`);

    // Create Faculty
    const faculty = await Faculty.insertMany([
      {
        facultyId: 'FAC20241001',
        firstName: 'Dr. Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@college.edu',
        password: 'password123',
        phone: '9876543210',
        dateOfBirth: new Date('1980-05-15'),
        gender: 'Male',
        department: departments[0]._id, // CSE
        qualification: 'PhD',
        specialization: 'Artificial Intelligence',
        experience: 10,
        designation: 'Professor',
        salary: 80000,
        address: {
          street: '123 Main Street',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          pincode: '517501'
        }
      },
      {
        facultyId: 'FAC20241002',
        firstName: 'Dr. Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@college.edu',
        password: 'password123',
        phone: '9876543211',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'Female',
        department: departments[1]._id, // EEE
        qualification: 'PhD',
        specialization: 'Power Electronics',
        experience: 8,
        designation: 'Associate Professor',
        salary: 70000,
        address: {
          street: '456 College Road',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          pincode: '517501'
        }
      }
    ]);

    console.log(`✅ Created ${faculty.length} faculty members`);

    // Create Courses
    const courses = await Course.insertMany([
      {
        courseCode: 'CSE101',
        courseName: 'Bachelor of Technology in Computer Science',
        description: 'Comprehensive 4-year program in Computer Science and Engineering',
        department: departments[0]._id,
        credits: 180,
        duration: 4,
        type: 'Undergraduate',
        semester: 1,
        maxStudents: 60,
        fee: 80000,
        startDate: new Date('2024-08-01'),
        faculty: [faculty[0]._id]
      },
      {
        courseCode: 'EEE101',
        courseName: 'Bachelor of Technology in Electrical Engineering',
        description: 'Comprehensive 4-year program in Electrical and Electronics Engineering',
        department: departments[1]._id,
        credits: 180,
        duration: 4,
        type: 'Undergraduate',
        semester: 1,
        maxStudents: 50,
        fee: 75000,
        startDate: new Date('2024-08-01'),
        faculty: [faculty[1]._id]
      }
    ]);

    console.log(`✅ Created ${courses.length} courses`);

    // Create Students
    const students = await Student.insertMany([
      {
        studentId: 'STU20241001',
        firstName: 'Aarav',
        lastName: 'Patel',
        email: 'aarav.patel@student.college.edu',
        password: 'password123',
        phone: '9876543220',
        dateOfBirth: new Date('2005-03-10'),
        gender: 'Male',
        department: departments[0]._id,
        course: courses[0]._id,
        semester: 1,
        address: {
          street: '789 Student Lane',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          pincode: '517502'
        },
        guardian: {
          name: 'Suresh Patel',
          relationship: 'Father',
          phone: '9876543221',
          email: 'suresh.patel@gmail.com'
        }
      },
      {
        studentId: 'STU20241002',
        firstName: 'Ananya',
        lastName: 'Singh',
        email: 'ananya.singh@student.college.edu',
        password: 'password123',
        phone: '9876543222',
        dateOfBirth: new Date('2005-07-22'),
        gender: 'Female',
        department: departments[1]._id,
        course: courses[1]._id,
        semester: 1,
        address: {
          street: '321 University Road',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          pincode: '517502'
        },
        guardian: {
          name: 'Rakesh Singh',
          relationship: 'Father',
          phone: '9876543223',
          email: 'rakesh.singh@gmail.com'
        }
      }
    ]);

    console.log(`✅ Created ${students.length} students`);

    // Update course enrollment
    await Course.findByIdAndUpdate(courses[0]._id, { currentEnrollment: 1 });
    await Course.findByIdAndUpdate(courses[1]._id, { currentEnrollment: 1 });

    console.log('🎉 Database seeded successfully with sample data!');
    console.log(`
📊 Sample Data Created:
   - ${departments.length} Departments
   - ${faculty.length} Faculty Members  
   - ${courses.length} Courses
   - ${students.length} Students

🔐 Sample Login Credentials:
   Faculty:
   - Email: rajesh.kumar@college.edu | Password: password123
   - Email: priya.sharma@college.edu | Password: password123
   
   Students:
   - Email: aarav.patel@student.college.edu | Password: password123
   - Email: ananya.singh@student.college.edu | Password: password123
`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

module.exports = seedData;